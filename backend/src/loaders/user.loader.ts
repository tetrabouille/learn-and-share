import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { prisma } from '../db/prisma';
import { MappedUser, mapUser } from '../utils/mapping';

const batchUsers = async (ids: readonly number[]) => {
  const users = await prisma.user
    .findMany({ where: { id: { in: [...ids] } } })
    .then((users) => users.map(mapUser));
  const mapUsers = keyBy(users, 'id');
  return ids.map((id) => mapUsers[id]);
};

export const userLoader = new DataLoader<number, MappedUser | null>(batchUsers);
