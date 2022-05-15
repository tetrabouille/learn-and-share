import logger from './logger';

export type UserError = {
  message: string;
  code: string;
};

export enum Error {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_LANG = 'INVALID_LANG',
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

export const getMessage = (error: Error) => {
  switch (error) {
    // General
    case Error.FIELD_REQUIRED:
      return 'Missing required fields';
    case Error.INVALID_LANG:
      return 'Invalid language';
    // Access
    case Error.NOT_REGISTERED:
      return 'No account registered';
    // User
    case Error.USER_ALREADY_EXISTS:
      return 'User already exists';
    case Error.USER_NOT_FOUND:
      return 'User not found';
    // Topic
    case Error.TOPIC_ALREADY_EXISTS:
      return 'Topic already exists';
    // Tag
    case Error.TAG_ALREADY_EXISTS:
      return 'Tag already exists';

    default:
      return 'Unknown error';
  }
};

export const getError = (model: string) => (errors: Error[]) => {
  logger.error(errors.map((e) => getMessage(e)).join(', '), model);
  return {
    [model]: null,
    userErrors: errors.map((error) => ({ message: getMessage(error), code: error })),
  };
};
