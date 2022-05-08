import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort } from '../schemas/commun.schema';
import { orderBy, getPagination, getFilter } from '../utils/commun';
import { Error, getError } from '../utils/errors';

const error = getError('topic');
const sortFields = ['name', 'lang'];

// queries
const topicGetAll = (filter?: Filter, pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.topic.findMany({
    ...getPagination(pagination),
    where: getFilter(filter),
    orderBy: orderBy(sortList, sortFields),
  });
};

// mutations
// TODO

const context = {
  // queries
  topicGetAll,
  // mutations
  // TODO
};
type TopicContext = typeof context & { accountId: string };

export default context;
export { TopicContext };
