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
    default:
      return 'Unknown error';
  }
};

export const getError = (model: string) => (errors: Error[]) => ({
  [model]: null,
  userErrors: errors.map((error) => ({ message: getMessage(error), code: error })),
});
