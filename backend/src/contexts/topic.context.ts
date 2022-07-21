import { Topic } from 'prisma/prisma-client';
import { prisma } from '../db/prisma';
import { TopicAddArgs, Filter, Pagination, Sort } from '../schemas';
import { logger, accessUtils, communUtils, errorsUtils, validationUtils } from '../utils';
import { AuthData } from '../utils/auth';
import { fetchTranslation, translateText } from '../utils/translation';
import { topicLoader } from '../loaders/topic.loader';

const { Error } = errorsUtils;
const error = errorsUtils.getError('topic');
const sortFields = ['name', 'lang'];

// queries
const topicGetAll = (filters?: Filter[], pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.topic.findMany(communUtils.getFindManyParams(filters, pagination, sortList, sortFields));
};

const topicGetById = (id: string | number) => topicLoader.load(Number(id));

// mutations
const topicAdd = async (input: TopicAddArgs['input'], authData: AuthData) => {
  const method = 'topicAdd';
  const { name, lang } = input;
  const { accountId, error: authError } = authData;

  if (!name || !lang) return error([Error.FIELD_REQUIRED], method);
  if (authError) return error([Error.TOKEN_EXPIRED], method);
  if (!(await accessUtils.isRegistered(accountId))) return error([Error.NOT_REGISTERED], method);
  if (!(await validationUtils.unique({ name, lang }, prisma.topic)))
    return error([Error.TOPIC_ALREADY_EXISTS], method);
  if (!validationUtils.lang(lang)) return error([Error.INVALID_LANG], method);

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
    error([Error.INTERNAL_ERROR], method);
  }
};

const topicTranslate = async (id: string | number, target: string) => {
  const method = 'topicTranslate';

  const fetchedTranslation = await fetchTranslation<Topic>(prisma.topic, id, target);
  if (fetchedTranslation == null) return error([Error.TOPIC_NOT_FOUND], method);
  if (fetchedTranslation.translation) return { topic: fetchedTranslation.translation, userErrors: [] };

  try {
    const topicRef = fetchedTranslation.dataRef as Topic;
    const translatedName = await translateText(topicRef.name, target);
    if (translatedName === null) return error([Error.TRANSLATION_FAILED], method);
    const translation = await prisma.topic.create({
      data: {
        name: translatedName,
        lang: target,
        translationRef: { connect: { id: topicRef.id } },
      },
    });
    return { topic: translation, userErrors: [] };
  } catch (e) {
    logger.error(e);
    error([Error.INTERNAL_ERROR], method);
  }
};

const context = {
  // queries
  topicGetAll,
  topicGetById,
  // mutations
  topicAdd,
  topicTranslate,
};
type TopicContext = typeof context & AuthData;

export default context;
export { TopicContext };
