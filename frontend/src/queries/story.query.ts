import { gql } from '@apollo/client/core';

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

export { STORY_ADD };
