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

export enum GenderEnum {
  F = 'F',
  M = 'M',
  X = 'X',
  C = 'C',
}

export const Gender = Object.freeze({
  [GenderEnum.F]: 'Female',
  [GenderEnum.M]: 'Male',
  [GenderEnum.X]: 'Prefer not to say',
  [GenderEnum.C]: 'Prefer to self-describe',
});

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
