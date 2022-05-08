import { gql } from 'apollo-server-express';

import { TopicContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type TopicGetAllArgs = {
  filter?: Filter;
  pagination?: Pagination;
  sortList?: Sort[];
};

const typeDefs = gql`
  type Topic {
    id: ID!
    name: String!
    lang: String!
    stories: [Story!]!
    translations: [Topic!]!
    translationRef: Topic
  }

  type Query {
    topics(filter: Filter, pagination: Pagination, sortList: [Sort!]): [Topic!]!
  }
`;

const resolvers = {
  // TODO

  Query: {
    topics: (_: void, { filter, pagination, sortList }: TopicGetAllArgs, { topicGetAll }: TopicContext) =>
      topicGetAll(filter, pagination, sortList),
  },

  Mutation: {},
};

export default { typeDefs, resolvers };
