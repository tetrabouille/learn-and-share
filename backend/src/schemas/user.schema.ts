import { gql } from 'apollo-server-express';

import { ProfileContext, UserContext } from '../contexts';

type ParentArgs = {
  id: string;
};

type UserAddArgs = {
  accountId: string;
  email: string;
  firstname: string;
  lastname: string;
};

type UserGetArgs = {
  userId?: string;
  accountId?: string;
};

const typeDefs = gql`
  type User {
    id: ID!
    accountId: String!
    hash: String!
    validated: Boolean!
    createdAt: String!
    updatedAt: String!
    roles: [String!]!
    profile: Profile!
  }

  type Query {
    users: [User!]!
    user(userId: ID, accountId: ID): User
    ownUser: User!
  }

  type Mutation {
    userAdd(accountId: String!, email: String!, firstname: String!, lastname: String!): UserPayload!
    userValidate: UserPayload!
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
    user: (_: void, { userId, accountId }: UserGetArgs, { userGetById, userGetByAccountId }: UserContext) =>
      accountId ? userGetByAccountId(accountId) : userGetById(userId),
    ownUser: (_: void, __: void, { userGetByAccountId, accountId }: UserContext) =>
      userGetByAccountId(accountId),
  },

  Mutation: {
    userAdd: (_: void, { accountId, email, firstname, lastname }: UserAddArgs, { userAdd }: UserContext) =>
      userAdd(accountId, email, firstname, lastname),
    userValidate: (_: void, __: void, { userValidate, accountId }: UserContext) => userValidate(accountId),
  },
};

export default { typeDefs, resolvers };
