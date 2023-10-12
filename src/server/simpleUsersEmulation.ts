import { createRandomElement, voteRandomElement } from './eventsGenerator';
import { storage } from './storage';

const getAvailableEvents = () => {
  const events = [];

  if (storage.votingData.createdProsAndCons.length) {
    events.push(voteRandomElement);
  }

  if (storage.votingData.pros.length || storage.votingData.cons.length) {
    events.push(createRandomElement);
  }

  return events;
};

export const runRandomEvent = () => {
  const events = getAvailableEvents();
  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];

  if (event) {
    console.log(typeof event.arguments[0]);
  } else {
    console.log('dont have available events');
  }
};
