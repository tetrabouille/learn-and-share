import { gql } from 'apollo-server-express';
import { TagContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type TagGetAllArgs = {
  filters?: Filter[];
  pagination?: Pagination;
  sortList?: Sort[];
};

export type TagAddArgs = {
  input: {
    name: string;
  };
};

export type TagTranslate = {
  target: string;
  id: string;
};

const typeDefs = gql`
  type Tag {
    id: ID!
    name: String!
    lang: String!
    stories: [Story!]!
    translations: [Tag!]!
    translationRef: Tag
    meanings: [Tag!]!
    meaningRef: Tag
    user: User!
  }

  type Query {
    tags(filters: [Filter!], pagination: Pagination, sortList: [Sort!]): [Tag!]!
  }

  type Mutation {
    tagAdd(input: TagAddInput!): TagPayload!
    tagTranslate(id: ID!, target: String!): TagPayload!
  }

  type TagPayload {
    tag: Tag
    userErrors: [UserError!]!
  }

  input TagAddInput {
    name: String!
  }
`;

const resolvers = {
  // TODO

  Query: {
    tags: (_: void, { filters, pagination, sortList }: TagGetAllArgs, { tagGetAll }: TagContext) =>
      tagGetAll(filters, pagination, sortList),
  },

  Mutation: {
    tagAdd: (_: void, { input }: TagAddArgs, { tagAdd, accountId, error }: TagContext) =>
      tagAdd(input, { accountId, error }),
    tagTranslate: (_: void, { target, id }: TagTranslate, { tagTranslate }: TagContext) =>
      tagTranslate(id, target),
  },
};

export default { typeDefs, resolvers };
