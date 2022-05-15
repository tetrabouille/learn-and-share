import { prisma } from '../db/prisma';
import { TopicAddArgs, Filter, Pagination, Sort } from '../schemas';
import { logger, accessUtils, communUtils, errorsUtils, validationUtils } from '../utils';

const { Error } = errorsUtils;
const error = errorsUtils.getError('topic');
const sortFields = ['name', 'lang'];

// queries
const topicGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.topic.findMany(communUtils.getFindManyParams(filters, pagination, sortList, sortFields));
};

// mutations
const topicAdd = async (input: TopicAddArgs['input'], accountId: string) => {
  const { name, lang } = input;

  if (!name || !lang) return error([Error.FIELD_REQUIRED]);
  if (!(await accessUtils.isRegistered(accountId))) return error([Error.NOT_REGISTERED]);
  if (!(await validationUtils.unique({ name, lang }, prisma.topic)))
    return error([Error.TOPIC_ALREADY_EXISTS]);
  if (!validationUtils.lang(lang)) return error([Error.INVALID_LANG]);

  try {
    const topic = await prisma.topic.create({
      data: {
        name,
        lang,
      },
    });
    return { topic, userErrors: [] };
  } catch (e) {
    logger.error(e);
    error([Error.INTERNAL_ERROR]);
  }
};

const context = {
  // queries
  topicGetAll,
  topicAdd,
  // mutations
  // TODO
};
type TopicContext = typeof context & { accountId: string };

export default context;
export { TopicContext };
