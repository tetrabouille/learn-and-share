import { gql } from "apollo-server-express";

import { PostContext, UserContext } from "../contexts";

type ParentArgs = {
  id: string;
};

type UserGetArgs = {
  userId: string;
};

type SignupArgs = {
  credentials: Credentials;
  name: string;
  bio?: string;
};

type LoginArgs = {
  credentials: Credentials;
};

type Credentials = {
  email: string;
  password: string;
};

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Query {
    users: [User!]!
    user(userId: ID): User
    ownUser: User!
  }

  type Mutation {
    signup(credentials: Credentials!, name: String!, bio: String): UserPayload!
    login(credentials: Credentials!): UserPayload!
  }

  type UserPayload {
    token: String
    userErrors: [UserError!]!
  }

  input Credentials {
    email: String!
    password: String!
  }
`;

const resolvers = {
  User: {
    posts: ({ id }: ParentArgs, __: any, { postGetManyByAuthor, userId }: PostContext) =>
      postGetManyByAuthor(id, userId),
  },

  Query: {
    users: (_: any, __: any, { userGetAll }: UserContext) => userGetAll(),
    user: (_: any, { userId }: UserGetArgs, { userGetById }: UserContext) => userGetById(userId),
    ownUser: (_: any, __: any, { userGetById, userId }: UserContext) => userGetById(userId),
  },

  Mutation: {
    signup: (_: any, { credentials, name, bio }: SignupArgs, { userCreate }: UserContext) =>
      userCreate(credentials, name, bio),
    login: (_: any, { credentials }: LoginArgs, { userLogin }: UserContext) => userLogin(credentials),
  },
};

export default { typeDefs, resolvers };

export { Credentials };
