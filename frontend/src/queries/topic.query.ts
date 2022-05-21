import { gql } from '@apollo/client/core';

const TOPIC_GET_ALL = gql`
  query Topics($sortList: [Sort!], $filters: [Filter!], $pagination: Pagination) {
    topics(sortList: $sortList, filters: $filters, pagination: $pagination) {
      id
      name
    }
  }
`;

const TOPIC_ADD = gql`
  mutation TopicAdd($input: TopicAddInput!) {
    topicAdd(input: $input) {
      topic {
        id
        name
        lang
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export { TOPIC_GET_ALL, TOPIC_ADD };
