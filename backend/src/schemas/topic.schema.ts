import { gql } from 'apollo-server-express';

import { TopicContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type TopicGetAllArgs = {
  filters?: Filter[];
  pagination?: Pagination;
  sortList?: Sort[];
};

export type TopicAddArgs = {
  input: {
    name: string;
    lang: string;
  };
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
    topics(filters: [Filter!], pagination: Pagination, sortList: [Sort!]): [Topic!]!
  }

  type Mutation {
    topicAdd(input: TopicAddInput!): TopicPayload
  }

  type TopicPayload {
    topic: Topic
    userErrors: [UserError!]
  }

  input TopicAddInput {
    name: String
    lang: String
  }
`;

const resolvers = {
  // TODO

  Query: {
    topics: (_: void, { filters, pagination, sortList }: TopicGetAllArgs, { topicGetAll }: TopicContext) =>
      topicGetAll(filters, pagination, sortList),
  },

  Mutation: {
    topicAdd: (_: void, { input }: TopicAddArgs, { topicAdd, accountId }: TopicContext) =>
      topicAdd(input, accountId),
  },
};

export default { typeDefs, resolvers };
