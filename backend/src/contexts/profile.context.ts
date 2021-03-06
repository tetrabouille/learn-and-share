import { prisma } from '../db/prisma';
import { ProfileAddArgs } from '../schemas/profile.schema';
import { accessUtils, logger, errorsUtils, validationUtils } from '../utils';

import type { AuthData } from '../utils/auth';

const { Error } = errorsUtils;
const error = errorsUtils.getError('profile');

// query
const profileGetByUser = (userId: string | number) =>
  prisma.profile.findUnique({ where: { userId: Number(userId) } });

const isOwnProfile = async (profileUserId: string, accountId?: string) => {
  const loggedUser = await accessUtils.isRegistered(accountId);
  if (!loggedUser) return false;
  return loggedUser.id === Number(profileUserId);
};

// mutation
const profileUpdate = async (
  id: ProfileAddArgs['id'],
  input: ProfileAddArgs['input'],
  authData: AuthData
) => {
  const method = 'profileUpdate';
  const { avatarUrl, bio, birthdate, firstname, gender, country, lastname, langs } = input;
  const { accountId, error: authError } = authData;

  if (authError) return error([Error.TOKEN_EXPIRED], method);
  if (!(await accessUtils.isRegistered(accountId))) return error([Error.NOT_REGISTERED], method);
  if (!validationUtils.langs(langs)) return error([Error.INVALID_LANG], method);
  if (country && !validationUtils.country(country)) return error([Error.INVALID_COUNTRY], method);

  try {
    const profile = await prisma.profile.update({
      where: { id: Number(id) },
      data: {
        avatarUrl,
        bio,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        firstname,
        gender,
        country,
        lastname,
        langs,
      },
    });
    return { profile, userErrors: [] };
  } catch (e: any) {
    if (e.code === 'P2025') return error([Error.PROFILE_NOT_FOUND], method);
    logger.error(e);
    return error([Error.INTERNAL_ERROR], method);
  }
};

const context = {
  // query
  profileGetByUser,
  isOwnProfile,
  // mutation
  profileUpdate,
};
type ProfileContext = typeof context & AuthData;

export default context;
export { ProfileContext };
