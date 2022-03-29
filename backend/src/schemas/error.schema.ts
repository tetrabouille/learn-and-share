import { gql } from 'apollo-server-express';

type UserError = {
  message: string;
};

const typeDefs = gql`
  type UserError {
    message: String!
  }
`;

export default { typeDefs };

export { UserError };
