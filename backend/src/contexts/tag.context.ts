import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort } from '../schemas';
import { TagAddArgs } from '../schemas/tag.schema';
import { communUtils, accessUtils, errorsUtils, logger, validationUtils } from '../utils';
import profileContext from './profile.context';
import type { AuthData } from '../utils/auth';

const { Error } = errorsUtils;
const error = errorsUtils.getError('tag');
const sortFields = ['name', 'lang', 'createdAt'];

// queries
const tagGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.tag
    .findMany(communUtils.getFindManyParams(filters, pagination, sortList, sortFields))
    .catch((e) => {
      logger.error(e);
      return [];
    });
};

// mutations
const tagAdd = async (input: TagAddArgs['input'], authData: AuthData) => {
  const { name } = input;
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!name) return error([Error.FIELD_REQUIRED]);
  if (authError) return error([Error.TOKEN_EXPIRED]);
  if (!loggedUser) return error([Error.NOT_REGISTERED]);

  try {
    const profile = await profileContext.profileGetByUser(loggedUser.id);

    if (!profile?.langs?.length) return error([Error.MISSING_LANGS]);
    if (!(await validationUtils.unique({ name, lang: profile.langs[0] }, prisma.tag)))
      return error([Error.TAG_ALREADY_EXISTS]);
    if (!validationUtils.lang(profile.langs[0])) return error([Error.INVALID_LANG]);

    const tag = await prisma.tag.create({
      data: {
        name,
        lang: profile.langs[0],
        userId: loggedUser.id,
      },
    });
    return { tag, userErrors: [] };
  } catch (e) {
    logger.error(e);
    return error([Error.INTERNAL_ERROR]);
  }
};

const context = {
  // queries
  tagGetAll,
  // mutations
  tagAdd,
};
type TagContext = typeof context & AuthData;

export default context;
export { TagContext };
