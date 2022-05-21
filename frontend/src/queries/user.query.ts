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
        id
        validated
        profile {
          id
          firstname
          lastname
        }
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
      validated
      roles
      profile {
        id
        firstname
        lastname
        birthdate
        gender
        avatarUrl
        bio
      }
    }
  }
`;

const USER_GET = gql`
  query User($userId: ID, $accountId: ID) {
    user(userId: $userId, accountId: $accountId) {
      id
      accountId
      validated
      roles
      profile {
        id
        firstname
        lastname
        birthdate
        gender
        avatarUrl
        bio
      }
    }
  }
`;

export { USER_ADD, USER_GET_ALL, USER_VALIDATE, USER_GET };
