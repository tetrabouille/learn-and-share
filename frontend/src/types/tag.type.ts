import type { UserError } from './error.type';
import type { Story } from './story.type';
import type { User } from './user.type';

export type Tag = {
  id?: number;
  name?: string;
  lang?: string;
  stories?: Story[];
  translations?: Tag[];
  translationRef?: Tag;
  meanings?: Tag[];
  meaningRef?: Tag;
  user?: User;
};

export type TagPayload = {
  tag: Tag;
  userErrors: UserError[];
};
