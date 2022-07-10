import { Tag } from 'prisma/prisma-client';
import { prisma } from '../db/prisma';

import { accessUtils, communUtils, errorsUtils, logger } from '../utils';
import type { Filter, Pagination, Sort } from '../schemas/commun.schema';
import type { AuthData } from '../utils/auth';
import { getMapStory } from '../utils/mapping';
import { Error, getMessage } from '../utils/errors';
import type { StoryAddArgs } from '../schemas/story.schema';
import { tagContext, topicContext } from '.';

const error = errorsUtils.getError('story');
const sortFields = ['title', 'content', 'lesson', 'published', 'lang', 'createdAt'];

// queries
const storyGetAll = async (
  authData: AuthData = {},
  filters?: Filter[],
  pagination?: Pagination,
  sortList?: Sort[]
) => {
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (authError) {
    logger.error(getMessage(Error.TOKEN_EXPIRED));
    return [];
  }

  const findManyParams = communUtils.getFindManyParams(filters, pagination, sortList, sortFields);

  let onlyPublished = true;
  if (loggedUser) {
    const filterAccountId = filters?.find(({ field }) => field === 'user.accountId');
    if (!filterAccountId) {
      findManyParams.where = {
        ...(findManyParams.where || {}),
        OR: [{ user: { accountId: loggedUser.accountId } }, { published: true }],
      };
      onlyPublished = false;
    }
    if (loggedUser.accountId === filterAccountId?.value) onlyPublished = false;
  }
  if (onlyPublished) {
    findManyParams.where = {
      ...(findManyParams.where || {}),
      published: true,
    };
  }

  return prisma.story
    .findMany(findManyParams)
    .then((stories) => stories.map(getMapStory(loggedUser)))
    .catch((e) => {
      logger.error(e);
      return [];
    });
};

const storyOwnGetAll = async (
  authData: AuthData,
  filters?: Filter[],
  pagination?: Pagination,
  sortList?: Sort[]
) => {
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!loggedUser) {
    logger.error(getMessage(Error.NOT_REGISTERED));
    return [];
  }
  if (authError) {
    logger.error(getMessage(Error.TOKEN_EXPIRED));
    return [];
  }

  const findManyParams = communUtils.getFindManyParams(filters, pagination, sortList, sortFields);
  findManyParams.where = {
    user: { accountId: authData.accountId },
  };
  return prisma.story
    .findMany(findManyParams)
    .then((stories) => stories.map(getMapStory(loggedUser)))
    .catch((e) => {
      logger.error(e);
      return [];
    });
};

const storyGetById = async (id: string, authData: AuthData = {}) => {
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (authError) {
    logger.error(getMessage(Error.TOKEN_EXPIRED));
    return null;
  }

  const params = { where: { id: Number(id), OR: [{ published: true } as any] } };
  if (loggedUser) params.where.OR.push({ user: { accountId: loggedUser.accountId } });
  return prisma.story
    .findFirst(params)
    .then(getMapStory(loggedUser))
    .catch((e) => {
      logger.error(e);
      return null;
    });
};

// mutations
const storyAdd = async (input: StoryAddArgs['input'], authData: AuthData) => {
  const { title, content, lesson, tagIds, newTags, topicId } = input;
  const { accountId, error: authError } = authData;
  const loggedUser = await accessUtils.isRegistered(accountId);

  if (!title || !content || !lesson || !topicId || !tagIds || !newTags) return error([Error.FIELD_REQUIRED]);
  if (!loggedUser) return error([Error.NOT_REGISTERED]);
  if (authError) return error([Error.TOKEN_EXPIRED]);

  try {
    if (tagIds.length) {
      const tags = await tagContext.tagGetAll([
        {
          field: 'id',
          value: [...tagIds].map((id) => Number(id)),
          option: 'in',
        },
      ]);
      if (!tags.length) return error([Error.TAG_NOT_FOUND]);
    }

    const topic = await topicContext.topicGetById(topicId);
    if (!topic) return error([Error.TOPIC_NOT_FOUND]);
    if (!loggedUser.profile) return error([Error.MISSING_PROFILE]);

    let createdTags;
    if (newTags.length) {
      createdTags = await tagContext.tagAddMany(
        newTags.map((name) => ({ name })),
        authData
      );
      if (createdTags.userErrors.length)
        return {
          story: null,
          userErrors: createdTags.userErrors,
        };
    }

    return {
      story: await prisma.story.create({
        data: {
          title,
          content,
          lesson,
          lang: loggedUser.profile.langs[0],
          userId: loggedUser.id,
          topicId: Number(topicId),
          tags: {
            connect: [
              ...tagIds.map((id) => ({ id: Number(id) })),
              ...(createdTags?.tags?.map((t) => ({ id: Number((t as Tag).id) })) || []),
            ],
          },
        },
      }),
      userErrors: [],
    };
  } catch (e) {
    logger.error(e);
    return error([Error.INTERNAL_ERROR]);
  }
};

const context = {
  // queries
  storyGetAll,
  storyOwnGetAll,
  storyGetById,
  // mutations
  storyAdd,
};
type StoryContext = typeof context & AuthData;

export default context;
export { StoryContext };
