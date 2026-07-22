import { authTypeDefs } from '@/modules/auth/graphql/typeDefs';
import { catalogTypeDefs } from '@/modules/catalog/graphql/typeDefs';
import { watchlistTypeDefs } from '@/modules/watchlist/graphql/typeDefs';
import { reviewsTypeDefs } from '@/modules/reviews/graphql/typeDefs';
import { searchTypeDefs } from '@/modules/search/graphql/typeDefs';

const baseTypeDefs = `#graphql
  type Query {
    status: String!
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, catalogTypeDefs, watchlistTypeDefs, reviewsTypeDefs, searchTypeDefs];
