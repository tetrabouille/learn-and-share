import { User } from 'prisma/prisma-client';

export type MappedUser = Omit<User, 'roles'> & {
  roles: string[];
};

const mapUser = (user: User | null): MappedUser | null => {
  if (!user) return null;
  return {
    ...user,
    roles: user.roles.split(';'),
  };
};

export { mapUser };
