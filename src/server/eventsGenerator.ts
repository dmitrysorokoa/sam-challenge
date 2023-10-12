import random from 'random';
import { EventType } from './types';
import { storage } from './storage';
import { eventsMap } from './eventsHandlers';
import { getRandomCreatedElement, getRandomElementText } from './helpers';

export const createRandomElement = () => {
  const randomIndex = random.int();
  let event: EventType.CreateCon | EventType.CreatePro | null = null;

  if (randomIndex) {
    if (storage.votingData.cons.length) {
      event = EventType.CreateCon;
    } else if (storage.votingData.pros.length) {
      event = EventType.CreatePro;
    }
  } else {
    if (storage.votingData.pros.length) {
      event = EventType.CreatePro;
    } else if (storage.votingData.cons.length) {
      event = EventType.CreateCon;
    }
  }

  if (event) {
    const text = getRandomElementText(
      storage.votingData[event === EventType.CreatePro ? 'pros' : 'cons'],
    );
    eventsMap[event](text, event === EventType.CreatePro ? 'pro' : 'con');
  }
};

export const voteRandomElement = () => {
  const events = [eventsMap[EventType.Dislike], eventsMap[EventType.Like]];

  const element = getRandomCreatedElement(
    storage.votingData.createdProsAndCons,
  );

  if (element) {
    events[random.int()](element);
  }
};
