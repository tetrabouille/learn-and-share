import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort } from '../schemas';
import { TagAddArgs } from '../schemas/tag.schema';
import { communUtils, accessUtils, errorsUtils, logger, validationUtils } from '../utils';

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
const tagAdd = async (input: TagAddArgs['input'], accountId: string) => {
  const { name, lang } = input;

  if (!name || !lang) return error([Error.FIELD_REQUIRED]);
  if (!(await accessUtils.isRegistered(accountId))) return error([Error.NOT_REGISTERED]);
  if (!(await validationUtils.unique({ name, lang }, prisma.tag))) return error([Error.TAG_ALREADY_EXISTS]);
  if (!validationUtils.lang(lang)) return error([Error.INVALID_LANG]);

  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        lang,
      },
    });
    return { tag, userErrors: [] };
  } catch (e) {
    logger.error(e);
    error([Error.INTERNAL_ERROR]);
  }
};

const context = {
  // queries
  tagGetAll,
  // mutations
  tagAdd,
};
type TagContext = typeof context & { accountId: string };

export default context;
export { TagContext };
