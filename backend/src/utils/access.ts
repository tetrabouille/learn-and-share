import { prisma } from '../db/prisma';

const isRegistered = async (accountId?: string) => {
  if (!accountId) return null;
  try {
    const user = prisma.user.findUnique({ where: { accountId } });
    return user;
  } catch (e) {
    return null;
  }
};

export { isRegistered };
