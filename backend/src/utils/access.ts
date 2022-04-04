import { prisma } from '../db/prisma';

const isRegistered = async (userId?: number) => {
  if (userId == null) return null;
  return prisma.user.findUnique({ where: { id: userId } });
};

export { isRegistered };
