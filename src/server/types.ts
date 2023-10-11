export enum EventType {
  CreatePro = 'CreatePro',
  CreateCon = 'CreateCon',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type ElementType = 'con' | 'pro';

export interface ProConElement {
  id: string;
  title: string;
  likes: number;
  dislikes: number;
  type: ElementType;
}

export interface Message {
  id: string;
  event: EventType;
  elementType: ElementType;
  time: string;
  title: string;
}

export interface VotingResult {
  pros: string[];
  cons: string[];
  createdProsAndCons: ProConElement[];
  startDate: number;
  messages: Message[];
}
