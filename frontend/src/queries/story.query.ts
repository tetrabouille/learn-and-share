import { gql } from '@apollo/client/core';

const STORY_GET = gql`
  query Story($storyId: ID!) {
    story(id: $storyId) {
      id
      title
      content
      lesson
      published
      lang
      isOwn
      createdAt
      updatedAt
    }
  }
`;

const STORY_GET_OWN = gql`
  query OwnStories {
    ownStories {
      id
      title
      content
      lesson
      published
      lang
      isOwn
      createdAt
      updatedAt
    }
  }
`;

const getStoryGetAll = (extraQuery: string) => {
  return gql`
    query Stories($filters: [Filter!], $pagination: Pagination, $sortList: [Sort!]) {
      stories(filters: $filters, pagination: $pagination, sortList: $sortList) {
        id
        title
        content
        lesson
        published
        lang
        isOwn
        topic {
          id
          name
        }
        tags {
          id
          name
        }
        createdAt
        updatedAt
        ${extraQuery}
      }
    }
  `;
};
const STORY_GET_ALL = getStoryGetAll('');

const STORY_ADD = gql`
  mutation StoryAdd($input: StoryAddInput!) {
    storyAdd(input: $input) {
      story {
        id
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export { STORY_ADD, STORY_GET, STORY_GET_ALL, STORY_GET_OWN, getStoryGetAll };
