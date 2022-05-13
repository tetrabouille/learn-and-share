import { gql } from 'apollo-server-express';
import { TagContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type TagGetAllArgs = {
  filter?: Filter;
  pagination?: Pagination;
  sortList?: Sort[];
};

export type TagAddArgs = {
  input: {
    name: string;
    lang: string;
  };
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
  }

  type Query {
    tags(filter: Filter, pagination: Pagination, sortList: [Sort!]): [Tag!]!
  }

  type Mutation {
    tagAdd(input: TagAddInput!): TagPayload
  }

  type TagPayload {
    tag: Tag
    userErrors: [UserError!]!
  }

  input TagAddInput {
    name: String!
    lang: String!
  }
`;

const resolvers = {
  // TODO

  Query: {
    tags: (_: void, { filter, pagination, sortList }: TagGetAllArgs, { tagGetAll }: TagContext) =>
      tagGetAll(filter, pagination, sortList),
  },

  Mutation: {
    tagAdd: (_: void, { input }: TagAddArgs, { tagAdd, accountId }: TagContext) => tagAdd(input, accountId),
  },
};

export default { typeDefs, resolvers };
