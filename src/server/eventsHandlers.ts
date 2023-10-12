import { faker } from '@faker-js/faker';
import { convertMillisecondsInTime } from './helpers';
import { ElementType, EventType, ProConElement } from './types';
import { storage } from './storage';

export const likeEvent = (element: ProConElement) => {
  element.likes = element.likes + 1;

  storage.votingData.messages.push({
    id: faker.string.uuid(),
    event: EventType.Like,
    elementType: element.type,
    time: convertMillisecondsInTime(Date.now() - storage.votingData.startDate),
    title: element.title,
  });
};

export const dislikeEvent = (element: ProConElement) => {
  element.dislikes = element.dislikes + 1;

  storage.votingData.messages.push({
    id: faker.string.uuid(),
    event: EventType.Dislike,
    elementType: element.type,
    time: convertMillisecondsInTime(Date.now() - storage.votingData.startDate),
    title: element.title,
  });
};

export const createElementEvent = (text: string, type: ElementType) => {
  storage.votingData.createdProsAndCons.push({
    id: faker.string.uuid(),
    title: text,
    likes: 0,
    dislikes: 0,
    type,
  });

  storage.votingData.messages.push({
    id: faker.string.uuid(),
    event: type === 'con' ? EventType.CreateCon : EventType.CreatePro,
    elementType: type,
    time: convertMillisecondsInTime(Date.now() - storage.votingData.startDate),
    title: text,
  });
};

export const createConEvent = (text: string) => {
  storage.votingData.createdProsAndCons.push({
    id: faker.string.uuid(),
    title: text,
    likes: 0,
    dislikes: 0,
    type: 'con',
  });

  storage.votingData.messages.push({
    id: faker.string.uuid(),
    event: EventType.CreateCon,
    elementType: 'con',
    time: convertMillisecondsInTime(Date.now() - storage.votingData.startDate),
    title: text,
  });
};

export const createProEvent = (text: string) => {
  storage.votingData.createdProsAndCons.push({
    id: faker.string.uuid(),
    title: text,
    likes: 0,
    dislikes: 0,
    type: 'pro',
  });

  storage.votingData.messages.push({
    id: faker.string.uuid(),
    event: EventType.CreatePro,
    elementType: 'pro',
    time: convertMillisecondsInTime(Date.now() - storage.votingData.startDate),
    title: text,
  });
};

export const eventsMap = {
  [EventType.CreateCon]: createElementEvent,
  [EventType.CreatePro]: createElementEvent,
  [EventType.Like]: likeEvent,
  [EventType.Dislike]: dislikeEvent,
};
