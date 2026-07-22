import { GraphQLContext } from '@/graphql/context';
import { watchlistService } from '../service/watchlist.service';
import { UnauthorizedError } from '@/shared/errors';

export const watchlistResolvers = {
  Query: {
    myWatchlist: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return watchlistService.getUserWatchlist(context.user.id, { page, limit });
    },
    watchlistCount: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return watchlistService.getWatchlistCount(context.user.id);
    },
  },
  Mutation: {
    addToWatchlist: async (
      _parent: unknown,
      { contentId }: { contentId: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return watchlistService.addToWatchlist(context.user.id, contentId);
    },
    removeFromWatchlist: async (
      _parent: unknown,
      { contentId }: { contentId: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return watchlistService.removeFromWatchlist(context.user.id, contentId);
    },
  },
};
