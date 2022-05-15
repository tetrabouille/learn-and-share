import { prisma } from '../db/prisma';
import { accessUtils } from '../utils';

const profileGetByUser = (userId: string | number) =>
  prisma.profile.findUnique({ where: { userId: Number(userId) } });

const isOwnProfile = async (profileUserId: string, accountId: string) => {
  const loggedUser = await accessUtils.isRegistered(accountId);
  if (!loggedUser) return false;
  return loggedUser.id === Number(profileUserId);
};

const context = {
  profileGetByUser,
  isOwnProfile,
};
type ProfileContext = typeof context & { accountId: string };

export default context;
export { ProfileContext };
