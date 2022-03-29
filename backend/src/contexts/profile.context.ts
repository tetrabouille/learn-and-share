import { prisma } from '../db/prisma';
import { isConnected } from '../utils/access';

const profileGetByUser = (userId: string | number) =>
  prisma.profile.findUnique({ where: { userId: Number(userId) } });

const isOwnProfile = async (profileUserId: string, userId: number) => {
  const loggedUser = await isConnected(userId);
  if (!loggedUser) return false;
  return loggedUser.id === Number(profileUserId);
};

const context = {
  profileGetByUser,
  isOwnProfile,
};
type ProfileContext = typeof context & { userId: number };

export default context;
export { ProfileContext };
