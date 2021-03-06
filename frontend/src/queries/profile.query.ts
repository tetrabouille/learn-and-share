import { gql } from '@apollo/client/core';

const PROFILE_UPDATE = gql`
  mutation ProfileUpdate($id: ID!, $input: ProfileUpdateInput!) {
    profileUpdate(id: $id, input: $input) {
      profile {
        id
        firstname
        lastname
        birthdate
        gender
        country
        avatarUrl
        bio
        isOwnProfile
        langs
        user {
          id
        }
      }
      userErrors {
        message
        code
      }
    }
  }
`;

export { PROFILE_UPDATE };
