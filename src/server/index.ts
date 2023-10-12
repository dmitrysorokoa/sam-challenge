import express, { Express, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import random from 'random';
import compression from 'compression';
import {
  DISTRUBUTION_SAMPLES,
  Distribution,
  getChartData,
  getDistribution,
} from './distribution';
import { convertMillisecondsInTime, initVoting } from './helpers';
import { createElementEvent, dislikeEvent, likeEvent } from './eventsHandlers';
import { storage } from './storage';
import { createRandomElement, voteRandomElement } from './eventsGenerator';
import {
  VOTING_DURATION,
  RANDOM_ELEMENTS_COUNT,
  RANDOM_VOTES_COUNT,
} from './constants';

const app: Express = express();
app.use(cors());
app.use(compression());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('platformsh-config').config();
const port = !config.isValidPlatform() ? 3003 : config.port;

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static('public'));

app.get('/api/distributions', (req: Request, res: Response) => {
  res.send({
    ...DISTRUBUTION_SAMPLES,
    elementsDistribution: getChartData(storage.createElementTimeDistribution),
    votesDistribution: getChartData(storage.voteTimeDistribution),
  });
});

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const voteEndHandler = () => {
  console.log('vote ended');
  storage.votingStatus = false;
  storage.votingData.endDate = Date.now() - storage.votingData.startDate;

  storage.createEventsTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  storage.voteEventsTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  clearTimeout(storage.voteEndTimer);

  io.emit('vote end');
};

const voteStartHandler = (
  { votesDistributionType, elementsDistributionType } = {
    votesDistributionType: Distribution.LogNormalReverse,
    elementsDistributionType: Distribution.LogNormal,
  },
) => {
  console.log('vote started');
  storage.votingStatus = true;
  storage.votingData = initVoting();
  io.emit('vote start');

  storage.voteEndTimer = setTimeout(voteEndHandler, VOTING_DURATION);

  const elementsDistribution = getDistribution(elementsDistributionType).nums;

  storage.createElementTimeDistribution = Array(RANDOM_ELEMENTS_COUNT)
    .fill(0)
    .map(() => {
      const randomIndex = random.int(0, elementsDistribution.length);

      return elementsDistribution[randomIndex] || 0;
    });

  const firstElementCreationTime = Math.min(
    ...storage.createElementTimeDistribution,
  );

  const votesDistribution = getDistribution(votesDistributionType).nums.filter(
    (el) => el > firstElementCreationTime,
  );

  storage.voteTimeDistribution = Array(RANDOM_VOTES_COUNT)
    .fill(0)
    .map(() => {
      const randomIndex = random.int(0, votesDistribution.length);

      return votesDistribution[randomIndex] || 0;
    });

  storage.voteEventsTimers = storage.voteTimeDistribution.map((time) =>
    setTimeout(voteRandomElement, time),
  );

  storage.createEventsTimers = storage.createElementTimeDistribution.map(
    (time) => setTimeout(createRandomElement, time),
  );
};

let connectedUsers = 0;

let messagesInterval: NodeJS.Timeout;
let resultInterval: NodeJS.Timeout;

io.on('connection', (socket) => {
  if (!connectedUsers) {
    messagesInterval = setInterval(() => {
      io.emit('chat message', storage.votingData.messages);
    }, 500);

    resultInterval = setInterval(() => {
      const time = convertMillisecondsInTime(
        storage.votingData.endDate
          ? storage.votingData.endDate
          : storage.votingStatus
          ? Date.now() - storage.votingData.startDate
          : 0,
        false,
      );
      io.emit('vote result', {
        createdProsAndCons: storage.votingData.createdProsAndCons,
        time,
      });
    }, 1000);
  }
  connectedUsers++;
  console.log('connected users: ', connectedUsers);

  socket.on('disconnect', () => {
    connectedUsers--;
    console.log('connected users: ', connectedUsers);

    if (!connectedUsers) {
      clearInterval(messagesInterval);
      clearInterval(resultInterval);
    }
  });

  socket.on('vote start', voteStartHandler);
  socket.on('vote end', voteEndHandler);

  socket.on('vote status', () => {
    io.emit('vote status', storage.votingStatus);
  });

  socket.on('add pro or con', ({ text, type }) => {
    createElementEvent(text || faker.word.words({ count: 2 }), type);
  });

  socket.on('like', ({ id }) => {
    const element = storage.votingData.createdProsAndCons.find(
      (item) => item.id === id,
    );

    if (element) {
      likeEvent(element);
    }
  });

  socket.on('dislike', ({ id }) => {
    const element = storage.votingData.createdProsAndCons.find(
      (item) => item.id === id,
    );

    if (element) {
      dislikeEvent(element);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
