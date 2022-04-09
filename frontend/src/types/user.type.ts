import type { UserError } from './error.type';

export type User = {
  id?: number;
  accountId?: string;
  validated?: boolean;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  // profile: Profile;
  // stories: Story[];
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
