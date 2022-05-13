import logger from './logger';

export type UserError = {
  message: string;
  code: string;
};

export enum Error {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  // Forms
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  // User
  NOT_REGISTERED = 'NOT_REGISTERED',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  // Tag
  TAG_ALREADY_EXISTS = 'TAG_ALREADY_EXISTS',
  INVALID_LANG = 'INVALID_LANG',
}

export const getMessage = (error: Error) => {
  switch (error) {
    // General
    case Error.FIELD_REQUIRED:
      return 'Missing required fields';
    // User
    case Error.NOT_REGISTERED:
      return 'Account not registered';
    case Error.USER_ALREADY_EXISTS:
      return 'User already exists';
    case Error.USER_NOT_FOUND:
      return 'User not found';
    // Tag
    case Error.TAG_ALREADY_EXISTS:
      return 'Tag already exists';
    case Error.INVALID_LANG:
      return 'Invalid language';
    default:
      return 'Unknown error';
  }
};

export const getError = (model: string) => (errors: Error[]) => {
  logger.error(errors.join(', '), model);
  return {
    [model]: null,
    userErrors: errors.map((error) => ({ message: getMessage(error), code: error })),
  };
};
