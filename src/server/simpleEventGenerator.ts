import { eventsMap } from './eventsHandlers';
import { EventType, VotingResult } from './types';

const getAvailableEvents = (votingData: VotingResult) => {
  const events = [];

  if (votingData.createdProsAndCons.length) {
    events.push(eventsMap[EventType.Dislike], eventsMap[EventType.Like]);
  }

  if (votingData.pros.length) {
    events.push(eventsMap[EventType.CreatePro]);
  }

  if (votingData.cons.length) {
    events.push(eventsMap[EventType.CreateCon]);
  }

  return events;
};

export const runRandomEvent = (votingData: VotingResult) => {
  const events = getAvailableEvents(votingData);
  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];

  if (event) {
    console.log(typeof event.arguments[0]);
  } else {
    console.log('dont have available events');
  }
};
