import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort, TagAddArgs } from '../schemas';
import { communUtils, accessUtils, errorsUtils, logger, validationUtils } from '../utils';
import type { AuthData } from '../utils/auth';
const { Error } = errorsUtils;
const error = errorsUtils.getError('tag');
const errorMany = errorsUtils.getError('tags');
const sortFields = ['name', 'lang', 'createdAt'];

// queries
const tagGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  logger.debug(
    `tagGetAll findMany params ${JSON.stringify(
      communUtils.getFindManyParams(filters, pagination, sortList, sortFields),
      null,
      2
    )}`
  );
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
    const { profile } = loggedUser;

    if (!profile?.langs?.length) return error([Error.MISSING_LANGS]);
    if (!(await validationUtils.unique({ name, lang: profile.langs[0] }, prisma.tag)))
      return error([Error.TAG_ALREADY_EXISTS]);
    if (!validationUtils.lang(profile.langs[0])) return error([Error.INVALID_LANG]);

    return {
      tag: await prisma.tag.create({
        data: {
          name,
          lang: profile.langs[0],
          userId: loggedUser.id,
        },
      }),
      userErrors: [],
    };
  } catch (e) {
    logger.error(e);
    return error([Error.INTERNAL_ERROR]);
  }
};

const tagAddMany = async (inputs: TagAddArgs['input'][], authData: AuthData) => {
  const inputValid = inputs.every(({ name }) => name);
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!inputValid) return errorMany([Error.FIELD_REQUIRED]);
  if (authError) return errorMany([Error.TOKEN_EXPIRED]);
  if (!loggedUser) return errorMany([Error.NOT_REGISTERED]);

  try {
    const { profile } = loggedUser;

    if (!profile?.langs?.length) return errorMany([Error.MISSING_LANGS]);

    const uniqueTags = await validationUtils.unique(
      { name: { in: inputs.map(({ name }) => name) }, lang: profile.langs[0] },
      prisma.tag
    );
    if (!uniqueTags) return errorMany([Error.TAG_ALREADY_EXISTS]);
    if (!validationUtils.lang(profile.langs[0])) return errorMany([Error.INVALID_LANG]);

    await prisma.tag.createMany({
      data: [
        ...inputs.map((input) => ({
          name: input.name,
          lang: profile.langs[0],
          userId: loggedUser.id,
        })),
      ],
    });

    const tags = await tagGetAll([
      {
        field: 'name',
        value: inputs.map((i) => i.name),
        option: 'in',
      },
      {
        field: 'lang',
        value: profile.langs[0],
        option: 'in',
      },
    ]);

    return {
      tags,
      userErrors: [],
    };
  } catch (e) {
    logger.error(e);
    return errorMany([Error.INTERNAL_ERROR]);
  }
};

const context = {
  // queries
  tagGetAll,
  // mutations
  tagAdd,
  tagAddMany,
};
type TagContext = typeof context & AuthData;

export default context;
export { TagContext };
