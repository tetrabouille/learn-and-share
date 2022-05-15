import { prisma } from '../db/prisma';

import { errorsUtils } from '../utils';

const error = errorsUtils.getError('story');

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
