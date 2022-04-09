import jwt from 'jsonwebtoken';

const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    const tokenData = jwt.verify(token.split(' ')[1], String(process.env.JWT_SIGNATURE));
    return { accountId: tokenData.sub };
  } catch (e) {
    return null;
  }
};

export { getUserFromToken };
