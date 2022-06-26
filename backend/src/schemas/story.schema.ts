import { gql } from 'apollo-server-express';
import { StoryContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type StoryGetAllArgs = {
  filters?: Filter[];
  pagination?: Pagination;
  sortList?: Sort[];
};

type StoryGetByIdArgs = {
  id: string;
};

export type StoryAddArgs = {
  input: {
    title: string;
    content: string;
    lesson: string;
    topicId: number;
    tagIds: number[];
    newTags: string[];
  };
};

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

  type Query {
    stories(filters: [Filter!], pagination: Pagination, sortList: [Sort!]): [Story!]!
    ownStories(filters: [Filter!], pagination: Pagination, sortList: [Sort!]): [Story!]!
    story(id: ID!): Story
  }

  type Mutation {
    storyAdd(input: StoryAddInput!): StoryPayload!
  }

  type StoryPayload {
    story: Story
    userErrors: [UserError!]!
  }

  input StoryAddInput {
    title: String!
    content: String!
    lesson: String!
    topicId: ID!
    tagIds: [ID!]!
    newTags: [String!]!
  }
`;

const resolvers = {
  // TODO

  Query: {
    stories: (_: void, { filters, pagination, sortList }: StoryGetAllArgs, { storyGetAll }: StoryContext) =>
      storyGetAll(filters, pagination, sortList),
    ownStories: (
      _: void,
      { filters, pagination, sortList }: StoryGetAllArgs,
      { storyOwnGetAll, accountId, error }: StoryContext
    ) => storyOwnGetAll({ accountId, error }, filters, pagination, sortList),
    story: (_: void, { id }: StoryGetByIdArgs, { storyGetById }: StoryContext) => storyGetById(id),
  },

  Mutation: {
    storyAdd: (_: void, { input }: StoryAddArgs, { storyAdd, accountId, error }: StoryContext) =>
      storyAdd(input, { accountId, error }),
  },
};

export default { typeDefs, resolvers };
