import jwt from 'jsonwebtoken';

import { errorsUtils } from '../utils';
const { Error } = errorsUtils;

export type AuthData = {
  accountId?: string;
  error?: string;
};

const getUserFromToken = (token?: string): AuthData | null => {
  if (!token) return null;
  try {
    const tokenData = jwt.verify(token.split(' ')[1], String(process.env.JWT_SIGNATURE));
    return { accountId: tokenData.sub as string };
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      return { error: Error.TOKEN_EXPIRED };
    }
    return null;
  }
};

export { getUserFromToken };
