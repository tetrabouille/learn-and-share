import { prisma } from "../db/prisma";

import { PostInput } from "../schemas";
import { isConnected, isAuthor } from "../utils/access";

const error = (msgList: string[]) => ({
  post: null,
  userErrors: msgList.map((message) => ({ message })),
});

const postGetAll = () =>
  prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { published: true },
  });

const postGetById = (id: string | number) => prisma.post.findMany({ where: { id: Number(id) } });

const postGetManyByAuthor = async (userId: string | number, loggedUserId?: number) => {
  const loggedUser = await isConnected(loggedUserId);

  const where: { authorId: number; published?: boolean } = { authorId: Number(userId) };
  if (userId !== loggedUser?.id) where.published = true;

  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where,
  });
};

const postCreate = async ({ title, content }: PostInput, userId?: number) => {
  if (!title || !content) return error(["Missing title or content to create post"]);
  const loggedUser = await isConnected(userId);
  if (!loggedUser) return error(["Unauthorized"]);

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: loggedUser.id,
    },
  });

  return {
    post,
    userErrors: [],
  };
};

const postUpdate = async (id: string, { title, content }: PostInput, userId?: number) => {
  if (!title && !content) return error(["Nothing to update"]);

  const postFound = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!postFound) return error(["Post not found"]);

  if (!(await isAuthor(postFound, userId))) return error(["Unauthorized"]);

  const payload: any = {};
  if (title) payload.title = title;
  if (content) payload.content = content;

  const post = await prisma.post.update({
    data: { ...payload },
    where: { id: Number(id) },
  });

  return {
    post,
    userErrors: [],
  };
};

const postDelete = async (id: string, userId?: number) => {
  const postFound = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!postFound) return error(["Post not found"]);
  if (!(await isAuthor(postFound, userId))) return error(["Unauthorized"]);

  const post = await prisma.post.delete({ where: { id: Number(id) } });

  return {
    post,
    userErrors: [],
  };
};

const postPublish = async (id: string, userId?: number, unpublish = false) => {
  const postFound = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!postFound) return error(["Post not found"]);
  if (!(await isAuthor(postFound, userId))) return error(["Unauthorized"]);

  const post = await prisma.post.update({
    data: { ...postFound, published: !unpublish },
    where: { id: Number(id) },
  });

  return {
    post,
    userErrors: [],
  };
};

const context = {
  postGetAll,
  postGetById,
  postGetManyByAuthor,
  postCreate,
  postUpdate,
  postDelete,
  postPublish,
};
type PostContext = typeof context & { userId: number };

export default context;
export { PostContext };
