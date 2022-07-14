import { gql } from 'apollo-server-express';
import { StoryContext, TagContext, TopicContext, UserContext } from '../contexts';
import { Filter, Pagination, Sort } from './commun.schema';

type StoryGetAllArgs = {
  filters?: Filter[];
  pagination?: Pagination;
  sortList?: Sort[];
};

type StoryGetByIdArgs = {
  id: string;
};

type StoryPublishArgs = {
  id: string;
};

type ParentArgs = {
  userId: string;
  topicId: string;
  id: string;
};

export type StoryUpdateArgs = {
  id: string;
  input: StoryAddArgs['input'];
};

export type StoryAddArgs = {
  input: {
    title?: string;
    content?: string;
    lesson?: string;
    topicId?: number;
    tagIds?: number[];
    newTags?: string[];
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
    isOwn: Boolean!
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
    storyAdd(input: StoryInput!): StoryPayload!
    storyPublish(id: ID!): StoryPayload!
    storyUpdate(id: ID!, input: StoryInput!): StoryPayload!
  }

  type StoryPayload {
    story: Story
    userErrors: [UserError!]!
  }

  input StoryInput {
    title: String
    content: String
    lesson: String
    topicId: ID
    tagIds: [ID!]
    newTags: [String!]
  }
`;

const resolvers = {
  Story: {
    user: ({ userId }: ParentArgs, _: void, { userGetById }: UserContext) => userGetById(userId),
    topic: ({ topicId }: ParentArgs, _: void, { topicGetById }: TopicContext) => topicGetById(topicId),
    tags: ({ id }: ParentArgs, _: void, { tagGetAll }: TagContext) =>
      tagGetAll([{ field: 'stories.some.id', value: id }]),
  },

  Query: {
    stories: (
      _: void,
      { filters, pagination, sortList }: StoryGetAllArgs,
      { storyGetAll, error, accountId }: StoryContext
    ) => storyGetAll({ error, accountId }, filters, pagination, sortList),
    ownStories: (
      _: void,
      { filters, pagination, sortList }: StoryGetAllArgs,
      { storyOwnGetAll, accountId, error }: StoryContext
    ) => storyOwnGetAll({ accountId, error }, filters, pagination, sortList),
    story: (_: void, { id }: StoryGetByIdArgs, { storyGetById, accountId, error }: StoryContext) =>
      storyGetById(id, { accountId, error }),
  },

  Mutation: {
    storyAdd: (_: void, { input }: StoryAddArgs, { storyAdd, accountId, error }: StoryContext) =>
      storyAdd(input, { accountId, error }),
    storyPublish: (_: void, { id }: StoryPublishArgs, { storyPublish, accountId, error }: StoryContext) =>
      storyPublish(id, { accountId, error }),
    storyUpdate: (_: void, { id, input }: StoryUpdateArgs, { storyUpdate, accountId, error }: StoryContext) =>
      storyUpdate(id, input, { accountId, error }),
  },
};

export default { typeDefs, resolvers };
