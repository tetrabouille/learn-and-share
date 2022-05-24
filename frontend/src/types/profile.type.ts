import type { UserError } from './error.type';
import type { User } from './user.type';

export type Profile = {
  id?: number;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  langs?: string[];
  user?: User;
  createdAt?: string;
  updatedAt?: string;
};

export type ProfilePayload = {
  profile: Profile;
  userErrors: UserError[];
};

export type ProfileUpdateInput = {
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  langs?: string[];
};
