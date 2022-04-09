import { gql } from '@apollo/client/core';

const USER_ADD = gql`
  mutation UserAdd($accountId: String!, $email: String!, $firstname: String!, $lastname: String!) {
    userAdd(accountId: $accountId, email: $email, firstname: $firstname, lastname: $lastname) {
      user {
        id
      }
      userErrors {
        message
        code
      }
    }
  }
`;

const USER_VALIDATE = gql`
  mutation User {
    userValidate {
      user {
        firstname
        lastname
        validated
        id
      }
      userErrors {
        code
        message
      }
    }
  }
`;

const USER_GET_ALL = gql`
  query Users {
    users {
      id
      accountId
      firstname
      lastname
      validated
      roles
    }
  }
`;

const GET_LOGGED_USER = gql`
  query User($userId: ID, $accountId: ID) {
    user(userId: $userId, accountId: $accountId) {
      id
      firstname
      lastname
      validated
      roles
    }
  }
`;

export { USER_ADD, USER_GET_ALL, USER_VALIDATE, GET_LOGGED_USER };
