import { describe, it, expect, vi } from 'vitest';
import { recommendationsResolvers } from '@/modules/recommendations/graphql/resolvers';
import { recommendationsService } from '@/modules/recommendations/service/recommendations.service';
import { UnauthorizedError } from '@/shared/errors';

describe('Recommendations Integration & Resolver Tests', () => {
  it('similarContent query delegates to recommendationsService', async () => {
    vi.spyOn(recommendationsService, 'getSimilarContent').mockResolvedValueOnce({
      items: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    const result = await recommendationsResolvers.Query.similarContent({}, { contentId: 'c-1' });
    expect(result.totalCount).toBe(0);
  });

  it('continueDiscovering query throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(
      recommendationsResolvers.Query.continueDiscovering({}, {}, context)
    ).rejects.toThrow(UnauthorizedError);
  });

  it('continueDiscovering query returns recommendations for authenticated user', async () => {
    const context = { user: { id: 'u-1' } } as any;
    vi.spyOn(recommendationsService, 'getContinueDiscovering').mockResolvedValueOnce({
      items: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    const result = await recommendationsResolvers.Query.continueDiscovering({}, {}, context);
    expect(result.totalCount).toBe(0);
  });
});
