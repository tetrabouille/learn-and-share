import type { User, LoggedUser } from '@/types/user.type';

const checkUserRoles = (user: User, roles: string[]) => {
  if (!user) return false;
  if (roles?.length === 0 || !user.roles) return true;
  return roles.some((role) => user.roles.includes(role));
};

const hasRouteAccess = (loggedUser: LoggedUser, requireLogin: boolean, roles: string[]) => {
  if (!requireLogin) return true;
  if (!loggedUser?.isConnected) return false;
  if (!roles?.length) return true;
  return checkUserRoles(loggedUser.user, roles);
};

export { checkUserRoles, hasRouteAccess };
