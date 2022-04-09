export type UserError = {
  message: string;
  code: string;
};

export enum Error {
  // General
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  // User
  NOT_REGISTERED = 'NOT_REGISTERED',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
