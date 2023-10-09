import express, { Express, Request, Response } from 'express';
import path from 'path';
import { faker } from '@faker-js/faker';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import random from 'random';
import {
  Distribution,
  getDistribution,
  getLogNormalDistribution,
} from './distribution';

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    text: faker.word.words({ count: { min: 2, max: 3 } }),
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 999,
});

const initPros = [
  'English language',
  'High salaries',
  'Change careers easily',
  'Many visas to work',
  'Good nature',
  'Live close to the beach',
  'Good healthcare system',
  'Low crime rate',
  'Infrastructure',
  'Good air quality',
];

const initCons = [
  'Expensive country',
  'Hard to find your first job',
  'High taxes',
  'The weather can be extreme',
  'Scary wildlife and nature',
  'The sun is dangerous',
  'Some health services are costly',
  'Public transport is expensive',
  'Relationship with alcohol',
  'Everything closes early',
];

const initVoting = () => {
  return {
    pros: initPros.slice(),
    cons: initCons.slice(),
    createdPros: [],
    createdCons: [],
    voteCount: 0,
    startDate: Date.now(),
    time: '0:0',
  };
};

interface ProConElement {
  id: string;
  title: string;
  likes: number;
  dislikes: number;
}

let votingData:
  | {
      pros: string[];
      cons: string[];
      createdPros: ProConElement[];
      createdCons: ProConElement[];
      voteCount: number;
      startDate: number;
    }
  | undefined;

enum EventType {
  CreatePro = 'CreatePro',
  CreateCon = 'CreateCon',
  Like = 'Like',
  Dislike = 'Dislike',
}

const app: Express = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const convertMillisecondsInTime = (value: number, withMiliseconds = true) => {
  const min = Math.floor((value / 1000 / 60) << 0);
  const sec = Math.floor((value / 1000) % 60);
  const milliseconds = value % 1000;
  return `${min}:${sec}${withMiliseconds ? `.${milliseconds}` : ''}`;
};

const getAvailableEvents = () => {
  const events: any[] = [];

  if (
    (votingData?.createdPros.length || votingData?.createdCons.length) &&
    votingData.voteCount < 10000
  ) {
    events.push(EventType.Dislike, EventType.Like);
  }

  if (votingData?.pros.length) {
    events.push(EventType.CreatePro);
  }

  if (votingData?.cons.length) {
    events.push(EventType.CreateCon);
  }

  return events;
};

const getRandomCreatedElement = () => {
  if (!votingData) return;
  const proAndCons = votingData.createdCons.concat(votingData.createdPros);
  const randomIndex = Math.floor(Math.random() * proAndCons.length);
  return proAndCons[randomIndex];
};

const likeEvent = (selectedElement?: ProConElement) => {
  if (!votingData) return;
  const element: ProConElement | undefined =
    selectedElement || getRandomCreatedElement();

  if (!element) return;

  element.likes = element.likes + 1;

  votingData.voteCount++;

  io.emit('chat message', {
    id: faker.string.uuid(),
    message: `${convertMillisecondsInTime(
      Date.now() - votingData.startDate,
    )} like: ${element.title}`,
  });
};

const dislikeEvent = (selectedElement?: ProConElement) => {
  if (!votingData) return;
  const element: ProConElement | undefined =
    selectedElement || getRandomCreatedElement();

  if (!element) return;

  element.dislikes = element.dislikes + 1;

  votingData.voteCount++;

  io.emit('chat message', {
    id: faker.string.uuid(),
    message: `${convertMillisecondsInTime(
      Date.now() - votingData.startDate,
    )} dislike: ${element.title}`,
  });
};

const getRandomElement = (items: string[]) => {
  if (!votingData) return;
  const randomIndex = Math.floor(Math.random() * items.length);

  return items.splice(randomIndex, 1)[0];
};

const createConEvent = (text?: string) => {
  if (!votingData) return;
  const selecteCon = text || getRandomElement(votingData.cons);

  if (!selecteCon) return;

  votingData.createdCons.push({
    id: faker.string.uuid(),
    title: selecteCon,
    likes: 0,
    dislikes: 0,
  });

  io.emit('chat message', {
    id: faker.string.uuid(),
    message: `${convertMillisecondsInTime(
      Date.now() - votingData.startDate,
    )} create con: ${selecteCon}`,
  });
};

const createProEvent = (text?: string) => {
  if (!votingData) return;
  const selectePro = text || getRandomElement(votingData.pros);

  if (!selectePro) return;

  votingData.createdPros.push({
    id: faker.string.uuid(),
    title: selectePro,
    likes: 0,
    dislikes: 0,
  });

  io.emit('chat message', {
    id: faker.string.uuid(),
    message: `${convertMillisecondsInTime(
      Date.now() - votingData.startDate,
    )} create pro: ${selectePro}`,
  });
};

const eventsMap: any = {
  [EventType.CreateCon]: createConEvent,
  [EventType.CreatePro]: createProEvent,
  [EventType.Like]: likeEvent,
  [EventType.Dislike]: dislikeEvent,
};

let votingStatus = false;

const runRandomEvent = () => {
  if (!votingData) return;

  const events = getAvailableEvents();
  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];

  if (event) {
    eventsMap[event]();
  } else {
    console.log('dont have available events');
  }
};

let eventGeneratorTimerId: NodeJS.Timeout;

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
    bernoulli: { ...getDistribution(Distribution.Bernoulli) },
  });
});

app.get('/api/users', (req: Request, res: Response) => {
  res.send({ data: users });
});

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

let createEventsTimers: NodeJS.Timeout[] = [];
let voteEventsTimers: NodeJS.Timeout[] = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('vote start', () => {
    console.log('vote started');
    votingStatus = true;
    votingData = initVoting();
    io.emit('vote start');

    const nums = getLogNormalDistribution(10000).nums;

    const array = Array(20)
      .fill(0)
      .map(() => {
        const randomIndex = random.int(0, nums.length);

        return nums[randomIndex] || 0;
      });

    console.log(nums.length);
    console.log(array);

    voteEventsTimers = nums.map((el: number) => {
      return setTimeout(
        () => {
          const events = [EventType.Dislike, EventType.Like];
          const randomIndex = random.int();

          const event = events[randomIndex];

          if (event) {
            eventsMap[event]();
          } else {
            console.log('error');
          }
        },
        Math.abs(el - 300) * 1000,
      );
    });

    createEventsTimers = array.map((num) => {
      return setTimeout(() => {
        const events = [EventType.CreateCon, EventType.CreatePro];
        const randomIndex = random.int();

        const event = events[randomIndex];

        if (event) {
          eventsMap[event]();
        } else {
          console.log('error');
        }
      }, num * 1000);
    });

    return;

    eventGeneratorTimerId = setInterval(() => {
      runRandomEvent();
    }, 25);
  });

  socket.on('vote end', () => {
    console.log('vote ended');
    votingStatus = false;
    io.emit('vote end');

    createEventsTimers.forEach((timer) => {
      clearInterval(timer);
    });
    voteEventsTimers.forEach((timer) => {
      clearInterval(timer);
    });

    clearInterval(eventGeneratorTimerId);
  });

  socket.on('vote status', () => {
    io.emit('vote status', votingStatus);
  });

  socket.on('vote result', () => {
    if (Date.now() - (votingData?.startDate || 0) >= 300000) {
      io.emit('vote end');
    }

    io.emit('vote result', {
      pros: votingData?.createdPros,
      cons: votingData?.createdCons,
      voteCount: votingData?.voteCount,
      time: votingData
        ? convertMillisecondsInTime(Date.now() - votingData.startDate, false)
        : '0:0',
    });
  });

  socket.on('add pro or con', (data) => {
    if (!votingData) return;
    console.log(`add ${data.type}: ${data.text}`);

    if (data.type === 'pro') {
      createProEvent(data.text);
    } else {
      createConEvent(data.text);
    }
  });

  socket.on('like', (data) => {
    if (!votingData) return;

    if (data.type === 'pro') {
      likeEvent(votingData.createdPros.find((item) => item.id === data.id));
    } else {
      likeEvent(votingData.createdCons.find((item) => item.id === data.id));
    }
  });

  socket.on('dislike', (data) => {
    if (!votingData) return;

    if (data.type === 'pro') {
      dislikeEvent(votingData.createdPros.find((item) => item.id === data.id));
    } else {
      dislikeEvent(votingData.createdCons.find((item) => item.id === data.id));
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
