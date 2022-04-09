import { gql } from 'apollo-server-express';

type UserError = {
  message: string;
  code: string;
};

const typeDefs = gql`
  type UserError {
    message: String!
    code: String!
  }
`;

export default { typeDefs };

export { UserError };
