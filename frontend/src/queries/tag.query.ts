import { gql } from '@apollo/client/core';

const TAG_GET_ALL = gql`
  query TagGetAll($filters: [Filter!], $pagination: Pagination, $sortList: [Sort!]) {
    tags(filters: $filters, pagination: $pagination, sortList: $sortList) {
      id
      name
      lang
    }
  }
`;

const TAG_ADD = gql`
  mutation TagAdd($input: TagAddInput!) {
    tagAdd(input: $input) {
      tag {
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

export { TAG_GET_ALL, TAG_ADD };
