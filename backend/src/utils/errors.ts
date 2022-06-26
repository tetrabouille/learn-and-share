import logger from './logger';

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
  MISSING_PROFILE = 'MISSING_PROFILE',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  // Profile
  MISSING_LANGS = 'MISSING_LANGS',
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  // Tag
  TAG_ALREADY_EXISTS = 'TAG_ALREADY_EXISTS',
  // Topic
  TOPIC_ALREADY_EXISTS = 'TOPIC_ALREADY_EXISTS',
  // Story
  TOPIC_NOT_FOUND = 'TOPIC_NOT_FOUND',
  TAG_NOT_FOUND = 'TAG_NOT_FOUND',
}

export const getMessage = (error: Error) => {
  switch (error) {
    // General
    case Error.FIELD_REQUIRED:
      return 'Missing required fields';
    case Error.INVALID_LANG:
      return 'Invalid language';
    // Auth
    case Error.TOKEN_EXPIRED:
      return 'Token expired';
    // Access
    case Error.NOT_REGISTERED:
      return 'No account registered';
    // User
    case Error.MISSING_PROFILE:
      return 'Missing profile';
    case Error.USER_ALREADY_EXISTS:
      return 'User already exists';
    case Error.USER_NOT_FOUND:
      return 'User not found';
    // Profile
    case Error.MISSING_LANGS:
      return 'Missing languages';
    case Error.PROFILE_NOT_FOUND:
      return 'Profile not found';
    // Topic
    case Error.TOPIC_ALREADY_EXISTS:
      return 'Topic already exists';
    // Tag
    case Error.TAG_ALREADY_EXISTS:
      return 'Tag already exists';
    // Story
    case Error.TAG_NOT_FOUND:
      return 'Tag not found';
    case Error.TOPIC_NOT_FOUND:
      return 'Topic not found';

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
