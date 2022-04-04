import { prisma } from '../db/prisma';

import { userLoader } from '../loaders/user.loader';
import { isRegistered } from '../utils/access';

const error = (msgList: string[]) => ({
  user: null,
  userErrors: msgList.map((message) => ({ message })),
});

const userGetAll = () => prisma.user.findMany();

const userGetById = (id: string | number) => userLoader.load(Number(id));

const userAdd = async (id: string | number, firstname: string, lastname: string) => {
  const existingUser = await isRegistered(Number(id));
  if (existingUser) return error(['User already exists']);
  const user = await prisma.user.create({
    data: {
      id: Number(id),
      firstname,
      lastname,
      profile: {
        create: {
          bio: '',
        },
      },
    },
  });
  return { user, userErrors: [] };
};

const context = {
  userGetAll,
  userGetById,
  userAdd,
};
type UserContext = typeof context & { userId: number };

export default context;
export { UserContext };
