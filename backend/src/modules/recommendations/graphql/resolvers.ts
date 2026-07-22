import { GraphQLContext } from '@/graphql/context';
import { recommendationsService } from '../service/recommendations.service';
import { UnauthorizedError } from '@/shared/errors';

export const recommendationsResolvers = {
  Query: {
    similarContent: async (
      _parent: unknown,
      { contentId, page, limit }: { contentId: string; page?: number; limit?: number }
    ) => {
      return recommendationsService.getSimilarContent({ contentId, page, limit });
    },
    popularContent: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number }
    ) => {
      return recommendationsService.getPopularContent({ page, limit });
    },
    trendingRecommendations: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number }
    ) => {
      return recommendationsService.getTrendingContent({ page, limit });
    },
    topRatedContent: async (
      _parent: unknown,
      { page, limit, minimumReviews }: { page?: number; limit?: number; minimumReviews?: number }
    ) => {
      return recommendationsService.getTopRatedContent({ page, limit, minimumReviews });
    },
    continueDiscovering: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return recommendationsService.getContinueDiscovering(context.user.id, { page, limit });
    },
  },
};
