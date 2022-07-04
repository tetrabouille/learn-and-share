import { User, Story } from 'prisma/prisma-client';

export type MappedUser = Omit<User, 'roles'> & {
  roles: string[];
};

export type MappedStory = Story & {
  isOwn: boolean;
};

const mapUser = (user: User | null): MappedUser | null => {
  if (!user) return null;
  return {
    ...user,
    roles: user.roles.split(';'),
  };
};

const mapStory = (story: Story | null, user: MappedUser | null): MappedStory | null => {
  if (!story) return null;
  if (!user) return { ...story, isOwn: false };
  return {
    ...story,
    isOwn: story.userId === user.id,
  };
};

const getMapStory = (user: MappedUser | null) => (story: Story | null) => mapStory(story, user);

export { mapUser, getMapStory };
