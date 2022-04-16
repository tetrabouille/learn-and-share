import type { User } from './user.type';

export type Profile = {
  id?: number;
  bio?: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
};
