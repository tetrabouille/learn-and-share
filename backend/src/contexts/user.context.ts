import { prisma } from '../db/prisma';
import { userLoader } from '../loaders/user.loader';
import { getSimpleHash } from '../utils/crypto';
import { isRegistered } from '../utils/access';
import { Error, getError } from '../utils/errors';
import { mapUser } from '../utils/mapping';
import type { AuthData } from '../utils/auth';
import { communUtils, logger } from '../utils';
import type { Filter, Pagination, Sort } from '../schemas/commun.schema';

const error = getError('user');
const sortFields = ['profile.firstname', 'profile.lastname', 'createdAt'];

// queries

const userGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.user
    .findMany(communUtils.getFindManyParams(filters, pagination, sortList, sortFields))
    .then((users) => users.map(mapUser))
    .catch((e) => {
      logger.error(e);
      return [];
    });
};

const userGetById = (id: string | number | undefined) => userLoader.load(Number(id));

const userGetByAccountId = (accountId?: string) =>
  prisma.user.findUnique({ where: { accountId } }).then(mapUser);

const userGetByHash = (hash: string) => prisma.user.findUnique({ where: { hash } }).then(mapUser);

// mutations

const userValidate = async (accountId?: string) => {
  const loggedUser = await isRegistered(accountId);
  if (!loggedUser) return error([Error.NOT_REGISTERED]);

  if (loggedUser.validated) return { user: loggedUser, userErrors: [] };
  const user = prisma.user
    .update({
      where: { accountId },
      data: { validated: true },
    })
    .then(mapUser);
  return { user, userErrors: [] };
};

const userAdd = async (accountId: string, email: string, firstname: string, lastname: string) => {
  if (!accountId || !email || !firstname || !lastname) return error([Error.FIELD_REQUIRED]);

  const hash = getSimpleHash(email);
  const existingUserAccount = await userGetByAccountId(accountId);
  const existingUserHash = await userGetByHash(hash);
  if (existingUserAccount || existingUserHash) return error([Error.USER_ALREADY_EXISTS]);

  const user = await prisma.user
    .create({
      data: {
        accountId,
        hash,
        roles: 'user',
        profile: {
          create: {
            bio: '',
            firstname,
            lastname,
          },
        },
      },
    })
    .then(mapUser);
  return { user, userErrors: [] };
};

const context = {
  // queries
  userGetAll,
  userGetById,
  userGetByAccountId,
  // mutations
  userValidate,
  userAdd,
};
type UserContext = typeof context & AuthData;

export default context;
export { UserContext };
