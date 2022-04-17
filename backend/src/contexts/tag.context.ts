import { prisma } from '../db/prisma';

import { Error, getError } from '../utils/errors';

const error = getError('tag');

// queries
// TODO

// mutations
// TODO

const context = {
  // queries
  // TODO
  // mutations
  // TODO
};
type TagContext = typeof context & { accountId: string };

export default context;
export { TagContext };
