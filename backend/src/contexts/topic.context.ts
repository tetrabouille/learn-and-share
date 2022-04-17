import { prisma } from '../db/prisma';

import { Error, getError } from '../utils/errors';

const error = getError('topic');

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
type TopicContext = typeof context & { accountId: string };

export default context;
export { TopicContext };
