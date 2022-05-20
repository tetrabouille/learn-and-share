import type { UserError } from './error.type';
import type { Profile } from './profile.type';
import type { Story } from './story.type';

export type User = {
  id?: number;
  accountId?: string;
  validated?: boolean;
  firstname?: string;
  lastname?: string;
  roles: string[];
  profile?: Profile;
  stories: Story[];
  createdAt?: string;
  updatedAt?: string;
};

export type UserPayload = {
  user: User;
  userErrors: UserError[];
};

export type LoggedUser = {
  user: User | null;
  loading: boolean;
  isConnected: boolean;
};
