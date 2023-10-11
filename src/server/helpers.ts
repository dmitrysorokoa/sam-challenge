import { initCons, initPros } from './constants';
import { ProConElement, VotingResult } from './types';

export const initVoting = (): VotingResult => {
  return {
    pros: initPros.slice(),
    cons: initCons.slice(),
    createdProsAndCons: [],
    startDate: Date.now(),
    messages: [],
  };
};

export const convertMillisecondsInTime = (
  value: number,
  withMiliseconds = true,
) => {
  let min = String(Math.floor((value / 1000 / 60) << 0));
  let sec = String(Math.floor((value / 1000) % 60));
  let milliseconds = String(value % 1000);
  if (min.length === 1) {
    min = `${min.length === 1 ? '0' : ''}${min}`;
  }
  if (sec.length === 1) {
    sec = `${sec.length === 1 ? '0' : ''}${sec}`;
  }
  while (milliseconds.length < 3) {
    milliseconds = `0${milliseconds}`;
  }
  return `${min}:${sec}${withMiliseconds ? `.${milliseconds}` : ''}`;
};

export const getRandomCreatedElement = (
  items: ProConElement[],
): ProConElement => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const getRandomElementText = (items: string[]): string => {
  const randomIndex = Math.floor(Math.random() * items.length);

  return items.splice(randomIndex, 1)[0];
};
