import { Tag } from 'prisma/prisma-client';
import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort, TagAddArgs } from '../schemas';
import { communUtils, accessUtils, errorsUtils, logger, validationUtils } from '../utils';
import type { AuthData } from '../utils/auth';
import { fetchTranslation, translateText } from '../utils/translation';

const { Error } = errorsUtils;
const error = errorsUtils.getError('tag');
const errorMany = errorsUtils.getError('tags');
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

const tagGetAllWithIds = (ids: (string | number)[]) => {
  if (ids.length) {
    return tagGetAll([
      {
        field: 'id',
        value: [...ids].map((id) => Number(id)),
        option: 'in',
      },
    ]);
  }
  return [];
};

// mutations
const tagAdd = async (input: TagAddArgs['input'], authData: AuthData) => {
  const method = 'tagAdd';
  const { name } = input;
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!name) return error([Error.FIELD_REQUIRED], method);
  if (authError) return error([Error.TOKEN_EXPIRED], method);
  if (!loggedUser) return error([Error.NOT_REGISTERED], method);

  try {
    const { profile } = loggedUser;

    if (!profile?.langs?.length) return error([Error.MISSING_LANGS], method);
    if (!(await validationUtils.unique({ name, lang: profile.langs[0] }, prisma.tag)))
      return error([Error.TAG_ALREADY_EXISTS], method);
    if (!validationUtils.lang(profile.langs[0])) return error([Error.INVALID_LANG], method);

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
    return error([Error.INTERNAL_ERROR], method);
  }
};

const tagTranslate = async (id: string | number, target: string) => {
  const method = 'TagTranslate';

  const fetchedTranslation = await fetchTranslation<Tag>(prisma.tag, id, target);
  if (fetchedTranslation == null) return error([Error.TAG_NOT_FOUND], method);
  if (fetchedTranslation.translation) return { tag: fetchedTranslation.translation, userErrors: [] };

  try {
    const tagRef = fetchedTranslation.dataRef as Tag;
    const translatedName = await translateText(tagRef.name, target);
    if (translatedName === null) return error([Error.TRANSLATION_FAILED], method);
    const translation = await prisma.tag.create({
      data: {
        name: translatedName,
        lang: target,
        translationRef: { connect: { id: tagRef.id } },
        user: { connect: { id: tagRef.userId } },
      },
    });
    return { tag: translation, userErrors: [] };
  } catch (e) {
    logger.error(e);
    error([Error.INTERNAL_ERROR], method);
  }
};

const tagAddMany = async (inputs: TagAddArgs['input'][], authData: AuthData) => {
  const method = 'tagAddMany';
  const inputValid = inputs.every(({ name }) => name);
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!inputValid) return errorMany([Error.FIELD_REQUIRED], method);
  if (authError) return errorMany([Error.TOKEN_EXPIRED], method);
  if (!loggedUser) return errorMany([Error.NOT_REGISTERED], method);

  try {
    const { profile } = loggedUser;

    if (!profile?.langs?.length) return errorMany([Error.MISSING_LANGS], method);

    const uniqueTags = await validationUtils.unique(
      { name: { in: inputs.map(({ name }) => name) }, lang: profile.langs[0] },
      prisma.tag
    );
    if (!uniqueTags) return errorMany([Error.TAG_ALREADY_EXISTS], method);
    if (!validationUtils.lang(profile.langs[0])) return errorMany([Error.INVALID_LANG], method);

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
    return errorMany([Error.INTERNAL_ERROR], method);
  }
};

const tagAddManyFromNames = async (newTags: string[], authData: AuthData) => {
  if (!newTags.length)
    return {
      tags: [],
      userErrors: [],
    };
  return tagAddMany(
    newTags.map((name) => ({ name })),
    authData
  );
};

const context = {
  // queries
  tagGetAll,
  tagGetAllWithIds,
  // mutations
  tagAdd,
  tagAddMany,
  tagAddManyFromNames,
  tagTranslate,
};
type TagContext = typeof context & AuthData;

export default context;
export { TagContext };
