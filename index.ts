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
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 999,
});

const pros = [
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

const cons = [
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

enum EventType {
  CreatePro,
  CreateCon,
  Like,
  Dislike,
}

const app: Express = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3004',
  },
});

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
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
