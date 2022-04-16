import type { Story } from './story.type';

export type Topic = {
  id?: number;
  name?: string;
  stories?: Story[];
  translations?: Topic[];
  translationRef?: Topic;
};
