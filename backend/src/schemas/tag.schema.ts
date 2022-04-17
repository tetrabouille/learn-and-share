import { gql } from 'apollo-server-express';

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
`;

const resolvers = {
  // TODO

  Query: {},

  Mutation: {},
};

export default { typeDefs, resolvers };
