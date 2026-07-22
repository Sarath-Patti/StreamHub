import { authResolvers } from '@/modules/auth/graphql/resolvers';
import { catalogResolvers } from '@/modules/catalog/graphql/resolvers';
import { watchlistResolvers } from '@/modules/watchlist/graphql/resolvers';

const baseResolvers = {
  Query: {
    status: () => 'StreamHub initialized.',
  },
};

export const resolvers = {
  Query: {
    ...baseResolvers.Query,
    ...authResolvers.Query,
    ...catalogResolvers.Query,
    ...watchlistResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...catalogResolvers.Mutation,
    ...watchlistResolvers.Mutation,
  },
};
