import { Profile } from 'prisma/prisma-client';
import { prisma } from '../db/prisma';
import { mapUser, MappedUser } from './mapping';

const isRegistered = async (accountId?: string) => {
  if (!accountId) return null;
  try {
    const user = prisma.user
      .findUnique({ where: { accountId }, include: { profile: true } })
      .then(mapUser) as any as MappedUser & { profile: Profile };
    return user;
  } catch (e) {
    return null;
  }
};

export { isRegistered };
