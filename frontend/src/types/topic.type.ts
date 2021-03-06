import type { UserError } from './error.type';
import type { Story } from './story.type';

export type Topic = {
  id?: number;
  name?: string;
  lang?: string;
  stories?: Story[];
  translations?: Topic[];
  translationRef?: Topic;
};

export type TopicPayload = {
  topic: Topic;
  userErrors: UserError[];
};
