import { gql } from 'apollo-server-express';

import { ProfileContext, UserContext } from '../contexts';

type ParentArgs = {
  id: string;
};

type UserAddArgs = {
  firstname: string;
  lastname: string;
};

type UserGetArgs = {
  userId: string;
};

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    profile: Profile!
  }

  type Query {
    users: [User!]!
    user(userId: ID): User
    ownUser: User!
  }

  type Mutation {
    userAdd(id: ID!, firstname: String!, lastname: String!): UserPayload!
  }

  type UserPayload {
    user: User
    userErrors: [UserError!]!
  }
`;

const resolvers = {
  User: {
    profile: ({ id }: ParentArgs, _: void, { profileGetByUser }: ProfileContext) =>
      profileGetByUser(Number(id)),
  },

  Query: {
    users: (_: void, __: void, { userGetAll }: UserContext) => userGetAll(),
    user: (_: void, { userId }: UserGetArgs, { userGetById }: UserContext) => userGetById(userId),
    ownUser: (_: void, __: void, { userGetById, userId }: UserContext) => userGetById(userId),
  },

  Mutation: {
    userAdd: (_: void, { firstname, lastname }: UserAddArgs, { userAdd, userId }: UserContext) =>
      userAdd(userId, firstname, lastname),
  },
};

export default { typeDefs, resolvers };
