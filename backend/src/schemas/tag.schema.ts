import { gql } from 'apollo-server-express';
import { TagContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type TagGetAllArgs = {
  filter?: Filter;
  pagination?: Pagination;
  sortList?: Sort[];
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
`;

const resolvers = {
  // TODO

  Query: {
    tags: (_: void, { filter, pagination, sortList }: TagGetAllArgs, { tagGetAll }: TagContext) =>
      tagGetAll(filter, pagination, sortList),
  },

  Mutation: {},
};

export default { typeDefs, resolvers };
