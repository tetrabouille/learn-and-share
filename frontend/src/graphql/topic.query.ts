import { gql } from '@apollo/client/core';

const TOPIC_GET_ALL = gql`
  query Topics($sortList: [Sort!], $filter: Filter, $pagination: Pagination) {
    topics(sortList: $sortList, filter: $filter, pagination: $pagination) {
      id
      name
    }
  }
`;

export { TOPIC_GET_ALL };
