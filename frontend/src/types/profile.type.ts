import type { User } from './user.type';

export type Profile = {
  id?: number;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
};
