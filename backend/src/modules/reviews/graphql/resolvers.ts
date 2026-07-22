import { GraphQLContext } from '@/graphql/context';
import { reviewsService } from '../service/reviews.service';
import { CreateReviewInputDTO, UpdateReviewInputDTO } from '../types';
import { UnauthorizedError } from '@/shared/errors';

export const reviewsResolvers = {
  Query: {
    reviewsByContent: async (
      _parent: unknown,
      {
        contentId,
        page,
        limit,
        sortBy,
      }: { contentId: string; page?: number; limit?: number; sortBy?: 'newest' | 'highest' }
    ) => {
      return reviewsService.getReviewsByContent(contentId, { page, limit, sortBy });
    },
    myReviews: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return reviewsService.getUserReviews(context.user.id, { page, limit });
    },
    averageRating: async (_parent: unknown, { contentId }: { contentId: string }) => {
      return reviewsService.getAverageRating(contentId);
    },
    ratingDistribution: async (_parent: unknown, { contentId }: { contentId: string }) => {
      return reviewsService.getRatingDistribution(contentId);
    },
  },
  Mutation: {
    createReview: async (
      _parent: unknown,
      { input }: { input: CreateReviewInputDTO },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return reviewsService.createReview(context.user.id, input);
    },
    updateReview: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateReviewInputDTO },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return reviewsService.updateReview(context.user.id, id, input);
    },
    deleteReview: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return reviewsService.deleteReview(context.user.id, id);
    },
  },
};
