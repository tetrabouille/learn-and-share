import type { User } from '@supabase/supabase-js';
import type { Tag } from './tag.type';
import type { Topic } from './topic.type';

export type Story = {
  id?: number;
  title?: string;
  content?: string;
  lesson?: string;
  published?: boolean;
  user?: User;
  topic: Topic;
  tags: Tag[];
  translations?: Story[];
  translationRef?: Story;
  createdAt?: Date;
  updatedAt?: Date;
};
