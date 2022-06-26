import { gql } from 'apollo-server-express';

type Filter = {
  field: string;
  value: string | string[] | boolean | number | number[];
  option?: 'contains' | 'in';
};

type Pagination = {
  take: number;
  skip?: number;
  cursor?: {
    field: string;
    value: string;
    type?: 'number' | 'boolean' | 'string';
  };
};

type Sort = {
  field: string;
  order: 'asc' | 'desc';
};

const typeDefs = gql`
  input Filter {
    field: String!
    value: String!
    option: String
  }

  input Pagination {
    take: Int!
    skip: Int
    cursor: Cursor
  }

  input Cursor {
    field: String!
    value: String!
    type: String
  }

  input Sort {
    field: String!
    order: String!
  }
`;

export default { typeDefs };

export { Filter, Pagination, Sort };
