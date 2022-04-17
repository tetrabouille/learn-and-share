import { prisma } from '../db/prisma';

import { Error, getError } from '../utils/errors';

const error = getError('story');

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
type StoryContext = typeof context & { accountId: string };

export default context;
export { StoryContext };
