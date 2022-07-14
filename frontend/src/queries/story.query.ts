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
  mutation StoryAdd($input: StoryInput!) {
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

const STORY_PUBLISH = gql`
  mutation StoryPublish($id: ID!) {
    storyPublish(id: $id) {
      story {
        id
        title
        content
        lesson
        published
        lang
        isOwn
        createdAt
      }
      userErrors {
        message
        code
      }
    }
  }
`;

export { STORY_ADD, STORY_GET, STORY_GET_ALL, STORY_GET_OWN, STORY_PUBLISH, getStoryGetAll };
