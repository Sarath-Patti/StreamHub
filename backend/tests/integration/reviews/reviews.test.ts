import { describe, it, expect, vi } from 'vitest';
import { reviewsResolvers } from '@/modules/reviews/graphql/resolvers';
import { reviewsService } from '@/modules/reviews/service/reviews.service';
import { UnauthorizedError } from '@/shared/errors';

describe('Reviews Integration & Resolver Tests', () => {
  it('myReviews query throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(reviewsResolvers.Query.myReviews({}, {}, context)).rejects.toThrow(UnauthorizedError);
  });

  it('createReview mutation throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(
      reviewsResolvers.Mutation.createReview({}, { input: { contentId: 'c1', rating: 5 } }, context)
    ).rejects.toThrow(UnauthorizedError);
  });

  it('reviewsByContent query resolves paginated reviews list', async () => {
    vi.spyOn(reviewsService, 'getReviewsByContent').mockResolvedValueOnce({
      items: [
        {
          id: 'r-1',
          userId: 'u-1',
          contentId: 'c-1',
          user: { id: 'u-1', name: 'Alice' },
          rating: 5,
          review: 'Great movie!',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await reviewsResolvers.Query.reviewsByContent({}, { contentId: 'c-1', page: 1, limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].rating).toBe(5);
  });

  it('averageRating query resolves average score', async () => {
    vi.spyOn(reviewsService, 'getAverageRating').mockResolvedValueOnce(4.8);

    const score = await reviewsResolvers.Query.averageRating({}, { contentId: 'c-1' });
    expect(score).toBe(4.8);
  });
});
