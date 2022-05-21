import { gql } from 'apollo-server-express';

import { ProfileContext, UserContext } from '../contexts';

type ParentArgs = {
  userId: string;
};

type ProfileArgs = {
  userId: string;
};

const typeDefs = gql`
  type Profile {
    id: ID!
    firstname: String!
    lastname: String!
    birthdate: String
    gender: String
    avatarUrl: String
    bio: String!
    isOwnProfile: Boolean!
    user: User!
  }

  type Query {
    profile(userId: ID!): Profile
  }
`;

const resolvers = {
  Profile: {
    user: ({ userId }: ParentArgs, _: void, { userGetById }: UserContext) => userGetById(userId),
    isOwnProfile: (
      { userId: profileUserId }: ParentArgs,
      _: void,
      { isOwnProfile, accountId }: ProfileContext
    ) => isOwnProfile(profileUserId, accountId),
  },

  Query: {
    profile: (_: void, { userId }: ProfileArgs, { profileGetByUser }: ProfileContext) =>
      profileGetByUser(Number(userId)),
  },
};

export default { typeDefs, resolvers };
