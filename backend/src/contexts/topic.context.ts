import { prisma } from '../db/prisma';
import { TopicAddArgs, Filter, Pagination, Sort } from '../schemas';
import { logger, accessUtils, communUtils, errorsUtils, validationUtils } from '../utils';
import { AuthData } from '../utils/auth';

const { Error } = errorsUtils;
const error = errorsUtils.getError('topic');
const sortFields = ['name', 'lang'];

// queries
const topicGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.topic.findMany(communUtils.getFindManyParams(filters, pagination, sortList, sortFields));
};

const topicGetById = (id: string | number) => {
  return prisma.topic.findUnique({ where: { id: Number(id) } });
};

// mutations
const topicAdd = async (input: TopicAddArgs['input'], authData: AuthData) => {
  const { name, lang } = input;
  const { accountId, error: authError } = authData;

  if (!name || !lang) return error([Error.FIELD_REQUIRED]);
  if (authError) return error([Error.TOKEN_EXPIRED]);
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
  topicGetById,
  // mutations
  topicAdd,
};
type TopicContext = typeof context & AuthData;

export default context;
export { TopicContext };
