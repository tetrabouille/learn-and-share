import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Topic {
    id: ID!
    name: String!
    lang: String!
    stories: [Story!]!
    translations: [Topic!]!
    translationRef: Topic
  }
`;

const resolvers = {
  // TODO

  Query: {},

  Mutation: {},
};

export default { typeDefs, resolvers };
