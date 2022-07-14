import type { User } from './user.type';
import type { Tag } from './tag.type';
import type { Topic } from './topic.type';
import type { UserError } from './error.type';

export type Story = {
  id?: number;
  title?: string;
  content?: string;
  lesson?: string;
  published?: boolean;
  lang?: string;
  isOwn?: boolean;
  user?: User;
  topic?: Topic;
  tags?: Tag[];
  translations?: Story[];
  translationRef?: Story;
  createdAt?: string;
  updatedAt?: string;
};

export type StoryPayload = {
  story: Story;
  userErrors: UserError[];
};

export type StoryAddArgs = {
  input: StoryInput;
};

export type StoryInput = {
  title?: string;
  content?: string;
  lesson?: string;
  lang?: string;
  topicId?: number;
  tagIds?: number[];
  newTags?: string[];
};
