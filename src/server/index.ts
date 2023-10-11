import express, { Express, Request, Response } from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import random from 'random';
import {
  Distribution,
  getDistribution,
  getLogNormalDistribution,
} from './distribution';
import { EventType } from './types';
import {
  convertMillisecondsInTime,
  getRandomCreatedElement,
  getRandomElementText,
  initVoting,
} from './helpers';
import {
  createConEvent,
  createProEvent,
  dislikeEvent,
  eventsMap,
  likeEvent,
} from './eventsHandlers';
import { storage } from './storage';
import { faker } from '@faker-js/faker';

const app: Express = express();
app.use(cors());
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
    normal: { ...getDistribution(Distribution.Normal) },
    linear: { ...getDistribution(Distribution.Linear) },
    exp: { ...getDistribution(Distribution.Exp) },
    logNormal: { ...getDistribution(Distribution.LogNormal) },
  });
});

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const voteEndHandler = () => {
  console.log('vote ended');
  storage.votingStatus = false;

  storage.createEventsTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  storage.voteEventsTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  clearTimeout(storage.voteEndTimer);

  io.emit('vote end');
};

const voteStartHandler = () => {
  console.log('vote started');
  storage.votingStatus = true;
  storage.votingData = initVoting();
  io.emit('vote start');

  storage.voteEndTimer = setTimeout(voteEndHandler, 300000);

  const nums = getLogNormalDistribution(10000).nums;

  const array = Array(20)
    .fill(0)
    .map(() => {
      const randomIndex = random.int(0, nums.length);

      return nums[randomIndex] || 0;
    });

  console.log(nums.length);
  console.log(array);

  storage.voteEventsTimers = nums.map((el: number) => {
    return setTimeout(
      () => {
        const events = [
          eventsMap[EventType.Dislike],
          eventsMap[EventType.Like],
        ];

        const element = getRandomCreatedElement(
          storage.votingData.createdProsAndCons,
        );

        if (element) {
          events[random.int()](element);
        }
      },
      Math.abs(el - 300000),
    );
  });

  storage.createEventsTimers = array.map((num) => {
    return setTimeout(() => {
      const events = [
        eventsMap[EventType.CreateCon],
        eventsMap[EventType.CreatePro],
      ];
      const randomIndex = random.int();

      let text = getRandomElementText(
        storage.votingData[randomIndex ? 'pros' : 'cons'],
      );

      if (text) {
        events[randomIndex](text);
      } else {
        text = getRandomElementText(
          storage.votingData[!randomIndex ? 'pros' : 'cons'],
        );

        if (text) {
          events[Number(!randomIndex)](text);
        }
      }
    }, num);
  });
};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', () => {
    io.emit('chat message', storage.votingData.messages);
  });

  socket.on('vote start', voteStartHandler);
  socket.on('vote end', voteEndHandler);

  socket.on('vote status', () => {
    io.emit('vote status', storage.votingStatus);
  });

  socket.on('vote result', () => {
    io.emit('vote result', {
      createdProsAndCons: storage.votingData.createdProsAndCons,
      time: convertMillisecondsInTime(
        Date.now() - storage.votingData.startDate,
        false,
      ),
    });
  });

  socket.on('add pro or con', (data) => {
    const text = data.text || faker.word.words({ count: 2 });

    if (data.type === 'pro') {
      createProEvent(text);
    } else {
      createConEvent(text);
    }
  });

  socket.on('like', (data) => {
    const element = storage.votingData.createdProsAndCons.find(
      (item) => item.id === data.id,
    );

    if (element) {
      likeEvent(element);
    }
  });

  socket.on('dislike', (data) => {
    const element = storage.votingData.createdProsAndCons.find(
      (item) => item.id === data.id,
    );

    if (element) {
      dislikeEvent(element);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
