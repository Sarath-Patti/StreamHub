import { authTypeDefs } from '@/modules/auth/graphql/typeDefs';

const baseTypeDefs = `#graphql
  type Query {
    status: String!
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, authTypeDefs];
