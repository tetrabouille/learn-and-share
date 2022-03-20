import { gql } from "apollo-server-express";

import { ProfileContext, UserContext } from "../contexts";

type ParentArgs = {
  userId: string;
};

type ProfileArgs = {
  userId: string;
};

const typeDefs = gql`
  type Profile {
    id: ID!
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
    user: ({ userId }: ParentArgs, _: any, { userGetById }: UserContext) => userGetById(userId),
    isOwnProfile: ({ userId: profileUserId }: ParentArgs, _: any, { isOwnProfile, userId }: ProfileContext) =>
      isOwnProfile(profileUserId, userId),
  },

  Query: {
    profile: (_: any, { userId }: ProfileArgs, { profileGetByUser }: ProfileContext) =>
      profileGetByUser(Number(userId)),
  },
};

export default { typeDefs, resolvers };
