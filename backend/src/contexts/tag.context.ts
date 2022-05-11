import { prisma } from '../db/prisma';
import { Filter, Pagination, Sort } from '../schemas';
import { getFindManyParams } from '../utils/commun';

import { Error, getError } from '../utils/errors';

const error = getError('tag');
const sortFields = ['name', 'lang'];

// queries
const tagGetAll = (filter?: Filter, pagination?: Pagination, sortList?: Sort[]) => {
  return prisma.tag.findMany(getFindManyParams(filter, pagination, sortList, sortFields));
};

// mutations
// TODO

const context = {
  // queries
  tagGetAll,
  // mutations
  // TODO
};
type TagContext = typeof context & { accountId: string };

export default context;
export { TagContext };
