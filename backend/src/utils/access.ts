import { Post } from 'prisma/prisma-client';

import { prisma } from '../db/prisma';

const isAuthor = async (post: Post, userId?: number) => {
  const user = await isConnected(userId);
  if (!user) return null;
  return user.id === post.authorId ? user : null;
};

const isConnected = async (userId?: number) => {
  if (userId == null) return null;
  return prisma.user.findUnique({ where: { id: userId } });
};

export { isConnected, isAuthor };
