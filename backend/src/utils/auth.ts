import jwt from 'jsonwebtoken';

const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, String(process.env.JWT_SIGNATURE)) as {
      userId: number;
    };
  } catch (e) {
    return null;
  }
};

export { getUserFromToken };
