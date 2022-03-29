import { gql } from 'apollo-server-express';

import { PostContext, UserContext } from '../contexts';

type PostInput = {
  title?: string;
  content?: string;
};

type ParentArgs = {
  authorId: string;
};

type PostArgs = {
  id: string;
  input: PostInput;
};

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    postCreate(input: PostInput!): PostPayload!
    postUpdate(id: ID!, input: PostInput!): PostPayload!
    postDelete(id: ID!): PostPayload!
    postPublish(id: ID!): PostPayload!
    postUnpublish(id: ID!): PostPayload!
  }

  type PostPayload {
    post: Post
    userErrors: [UserError!]!
  }

  input PostInput {
    title: String
    content: String
  }
`;

const resolvers = {
  Post: {
    user: ({ authorId }: ParentArgs, _: any, { userGetById }: UserContext) => userGetById(authorId),
  },

  Query: {
    posts: (_: any, __: any, { postGetAll }: PostContext) => postGetAll(),
    post: (_: any, { id }: PostArgs, { postGetById }: PostContext) => postGetById(id),
  },

  Mutation: {
    postCreate: (_: any, { input }: PostArgs, { postCreate, userId }: PostContext) =>
      postCreate(input, userId),
    postUpdate: (_: any, { id, input }: PostArgs, { postUpdate, userId }: PostContext) =>
      postUpdate(id, input, userId),
    postDelete: (_: any, { id }: PostArgs, { postDelete, userId }: PostContext) => postDelete(id, userId),
    postPublish: (_: any, { id }: PostArgs, { postPublish, userId }: PostContext) => postPublish(id, userId),
    postUnpublish: (_: any, { id }: PostArgs, { postPublish, userId }: PostContext) =>
      postPublish(id, userId, true),
  },
};

export default { typeDefs, resolvers };

export { PostInput };
