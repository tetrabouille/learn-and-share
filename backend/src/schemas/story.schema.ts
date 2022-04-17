import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Story {
    id: ID!
    title: String!
    content: String!
    lesson: String
    published: Boolean!
    lang: String!
    createdAt: String!
    updatedAt: String!
    user: User!
    topic: Topic!
    tags: [Tag!]!
    translations: [Story!]!
    translationRef: Story
  }
`;

const resolvers = {
  // TODO

  Query: {},

  Mutation: {},
};

export default { typeDefs, resolvers };
