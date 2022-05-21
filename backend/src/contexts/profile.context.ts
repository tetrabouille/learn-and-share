import { prisma } from '../db/prisma';
import { accessUtils } from '../utils';

// query
const profileGetByUser = (userId: string | number) =>
  prisma.profile.findUnique({ where: { userId: Number(userId) } });

const isOwnProfile = async (profileUserId: string, accountId: string) => {
  const loggedUser = await accessUtils.isRegistered(accountId);
  if (!loggedUser) return false;
  return loggedUser.id === Number(profileUserId);
};

// mutation

// const profileUpdate = async (

const context = {
  // query
  profileGetByUser,
  isOwnProfile,
  // mutation
};
type ProfileContext = typeof context & { accountId: string };

export default context;
export { ProfileContext };
