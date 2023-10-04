import express, { Express, Request, Response } from 'express';
import path from 'path';
import { faker } from '@faker-js/faker';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Distribution, getDistribution } from './distribution';

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    text: faker.lorem.sentence(3),
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 999,
});

const initPros = [
  'English is the first language',
  'You can live in one of the cities with the highest quality of life in the world',
  'The unemployment rate is low, and salaries are high',
  'You can change careers easily',
  'Many visas exist to work in the country',
  'You’ll get an outstanding work-life balance',
  'You can go on short adventures',
  'Lots of nature and native wildlife',
  'You’ll live close to the beach',
  'There’s a good healthcare system',
  'The crime rate is very low',
  'Infrastructure',
  'People are relaxed and friendly',
  'There are a lot of immigrants and expats',
  'You can find delicious food from many cultures',
  'Australian wines and beers',
  'They serve excellent coffee',
  'It’s a great country for an active, healthy lifestyle',
  'The education system is well-regarded',
  'Good air quality',
];

const initCons = [
  'You’ll be far away from home',
  'It’s one of the most expensive countries in the world',
  'It can be hard to find your first qualified job',
  'Your rights will be limited until you become a permanent resident',
  'Taxes can be high at the start and impact your salary',
  'International travel can be complicated',
  'The weather can be extreme',
  'Wildlife and nature can be scary',
  'The sun is dangerous',
  'Some health services are costly, and specialists aren’t the best',
  'Public transport is expensive',
  'Lack of history and charm in cities',
  'It’s hard to get into the end-of-year festive spirit',
  'There are a lot of immigrants and expats !!!!!!!!',
  'Australian cuisine isn’t impressive',
  'Relationship with alcohol ',
  'Everything closes early',
  'Artists don’t often tour there',
  'It’s expensive to have kids',
  'High carbon footprint',
];

const initVoting = () => {
  return {
    pros: initPros.slice(),
    cons: initCons.slice(),
    createdPros: [],
    createdCons: [],
  };
};

interface ProConElement {
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
    origin: 'http://localhost:3004',
  },
});

const getAvailableEvents = () => {
  const events = [];

  if (votingData?.createdPros.length || votingData?.createdCons.length) {
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

const likeEvent = (selectedElement?: ProConElement) => {
  if (!votingData) return;
  let element: ProConElement | undefined;
  if (!selectedElement) {
    const proAndCons = [votingData.createdCons, votingData.createdPros];
    const randomIndexFirst = Math.floor(Math.random() * proAndCons.length);

    const selectedList = proAndCons[randomIndexFirst];

    if (selectedList) {
      const randomIndexSecond = Math.floor(Math.random() * selectedList.length);

      element = selectedList[randomIndexSecond];
    }
  }

  if (!element) return;

  element.likes = element.likes + 1;

  io.emit('chat message', `like: ${element.title}`);
};

const dislikeEvent = (selectedElement?: ProConElement) => {
  if (!votingData) return;
  let element: ProConElement | undefined;
  if (!selectedElement) {
    const proAndCons = [votingData.createdCons, votingData.createdPros];
    const randomIndexFirst = Math.floor(Math.random() * proAndCons.length);

    const selectedList = proAndCons[randomIndexFirst];

    if (selectedList) {
      const randomIndexSecond = Math.floor(Math.random() * selectedList.length);

      element = selectedList[randomIndexSecond];
    }
  }

  if (!element) return;

  element.dislikes = element.dislikes + 1;

  io.emit('chat message', `dislike: ${element.title}`);
};

const createConEvent = () => {
  if (!votingData) return;
  const randomIndex = Math.floor(Math.random() * votingData.cons.length);

  const selecteCon = votingData.cons.splice(randomIndex, 1)[0];

  if (!selecteCon) return;

  votingData.createdCons.push({ title: selecteCon, likes: 0, dislikes: 0 });

  io.emit('chat message', `create con: ${selecteCon}`);
};

const createProEvent = () => {
  if (!votingData) return;
  const randomIndex = Math.floor(Math.random() * votingData.pros.length);

  const selectePro = votingData.pros.splice(randomIndex, 1)[0];

  if (!selectePro) return;

  votingData.createdPros.push({ title: selectePro, likes: 0, dislikes: 0 });

  io.emit('chat message', `create pro: ${selectePro}`);
};

const eventsMap = {
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

  console.log('randomIndex ', randomIndex);
  console.log('events ', events);
  console.log('event ', event);

  if (event) {
    console.log('event chosen');
    eventsMap[event]();
  } else {
    console.log('dont have available events');
  }
};

let timerId: NodeJS.Timeout;

const config = require('platformsh-config').config();

const port = !config.isValidPlatform() ? 3003 : config.port;

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.static('public'));

app.get('/api/normal-distribution', (req: Request, res: Response) => {
  res.send({
    ...getDistribution(Distribution.Normal),
  });
});

app.get('/api/linear-distribution', (req: Request, res: Response) => {
  res.send({
    ...getDistribution(Distribution.Linear),
  });
});

app.get('/api/users', (req: Request, res: Response) => {
  res.send({ data: users });
});

app.use((req: Request, res: Response, next) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

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

    timerId = setInterval(() => {
      runRandomEvent();
    }, 1000);
  });

  socket.on('vote end', () => {
    console.log('vote ended');
    votingStatus = false;
    io.emit('vote end');

    clearInterval(timerId);
  });

  socket.on('vote status', () => {
    io.emit('vote status', votingStatus);
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
