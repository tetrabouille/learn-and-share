import { gql } from 'apollo-server-express';

import { ProfileContext, UserContext } from '../contexts';

type ParentArgs = {
  userId: string;
};

type ProfileArgs = {
  userId: string;
};

export type ProfileAddArgs = {
  id: string;
  input: {
    firstname?: string;
    lastname?: string;
    birthdate?: string;
    gender?: string;
    country?: string;
    avatarUrl?: string;
    bio?: string;
    langs?: string[];
  };
};

const typeDefs = gql`
  type Profile {
    id: ID!
    firstname: String!
    lastname: String!
    birthdate: String
    gender: String
    country: String
    avatarUrl: String
    bio: String!
    langs: [String!]!
    isOwnProfile: Boolean!
    user: User!
  }

  type Query {
    profile(userId: ID!): Profile
  }

  type Mutation {
    profileUpdate(id: ID!, input: ProfileUpdateInput!): ProfilePayload!
  }

  type ProfilePayload {
    profile: Profile
    userErrors: [UserError!]!
  }

  input ProfileUpdateInput {
    firstname: String
    lastname: String
    birthdate: String
    gender: String
    country: String
    avatarUrl: String
    bio: String
    langs: [String!]
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

  Mutation: {
    profileUpdate: (
      _: void,
      { id, input }: ProfileAddArgs,
      { profileUpdate, accountId, error }: ProfileContext
    ) => profileUpdate(id, input, { accountId, error }),
  },
};

export default { typeDefs, resolvers };
