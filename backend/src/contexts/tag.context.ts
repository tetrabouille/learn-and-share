import locales from 'locale-codes';

import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort } from '../schemas';
import { TagAddArgs } from '../schemas/tag.schema';
import { getFindManyParams } from '../utils/commun';
import { isRegistered } from '../utils/access';

import { Error, getError } from '../utils/errors';
import logger from '../utils/logger';

const error = getError('tag');
const sortFields = ['name', 'lang'];

// queries
const tagGetAll = (filter?: Filter, pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.tag.findMany(getFindManyParams(filter, pagination, sortList, sortFields)).catch((e) => {
    logger.error(e);
    return [];
  });
};

// mutations
const tagAdd = async (input: TagAddArgs['input'], accountId: string) => {
  const { name, lang } = input;

  if (!name || !lang) return error([Error.FIELD_REQUIRED]);
  if (!isRegistered(accountId)) return error([Error.NOT_REGISTERED]);
  const existingTag = await prisma.tag.findFirst({ where: { name, lang } });
  if (existingTag) return error([Error.TAG_ALREADY_EXISTS]);
  if (!locales.getByTag(lang)) return error([Error.INVALID_LANG]);

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
