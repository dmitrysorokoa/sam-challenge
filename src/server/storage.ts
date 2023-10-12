import { initVoting } from './helpers';
import { VotingResult } from './types';

interface LocalStorage {
  createEventsTimers: NodeJS.Timeout[];
  voteEventsTimers: NodeJS.Timeout[];
  voteEndTimer: any;
  votingData: VotingResult;
  votingStatus: boolean;
  createElementTimeDistribution: number[];
  voteTimeDistribution: number[];
}

export const storage: LocalStorage = {
  createEventsTimers: [],
  voteEventsTimers: [],
  voteEndTimer: null,
  votingData: initVoting(),
  votingStatus: false,
  createElementTimeDistribution: [],
  voteTimeDistribution: [],
};
