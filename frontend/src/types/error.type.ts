export type UserError = {
  message: string;
  code: string;
};

export enum Error {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_LANG = 'INVALID_LANG',
  // Auth
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  // Access
  NOT_REGISTERED = 'NOT_REGISTERED',
  // Forms
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  // User
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  // Tag
  TAG_ALREADY_EXISTS = 'TAG_ALREADY_EXISTS',
  // Topic
  TOPIC_ALREADY_EXISTS = 'TOPIC_ALREADY_EXISTS',
}
