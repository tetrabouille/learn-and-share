import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { Topic } from 'prisma/prisma-client';
import { prisma } from '../db/prisma';

const batchTopics = async (ids: readonly number[]) => {
  const topics = await prisma.topic.findMany({ where: { id: { in: [...ids] } } });
  const mapUsers = keyBy(topics, 'id');
  return ids.map((id) => mapUsers[id]);
};

export const topicLoader = new DataLoader<number, Topic | null>(batchTopics);
