import { describe, it, expect, vi } from 'vitest';
import { RecommendationsService } from '@/modules/recommendations/service/recommendations.service';
import { RecommendationsRepository } from '@/modules/recommendations/repository/recommendations.repository';
import { CatalogRepository } from '@/modules/catalog/repository/catalog.repository';
import { NotFoundError } from '@/shared/errors';

describe('RecommendationsService Unit Tests', () => {
  const mockRepo = {
    getSimilarContent: vi.fn(),
    getPopularContent: vi.fn(),
    getTrendingContent: vi.fn(),
    getTopRatedContent: vi.fn(),
    getContinueDiscovering: vi.fn(),
  } as unknown as RecommendationsRepository;

  const mockCatalogRepo = {
    findById: vi.fn(),
  } as unknown as CatalogRepository;

  const recommendationsService = new RecommendationsService(mockRepo, mockCatalogRepo);

  it('getSimilarContent throws NotFoundError if target content does not exist', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce(null);

    await expect(recommendationsService.getSimilarContent({ contentId: 'nonexistent' })).rejects.toThrow(NotFoundError);
  });

  it('getSimilarContent formats pagination and results', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce({ id: 'c-1' } as any);
    vi.spyOn(mockRepo, 'getSimilarContent').mockResolvedValueOnce({
      items: [
        {
          id: 'c-2',
          title: 'Similar Movie',
          description: 'Desc',
          type: 'MOVIE',
          releaseYear: 2020,
          language: 'English',
          rating: 8.5,
          isTrending: false,
          genres: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any,
      total: 1,
    });

    const result = await recommendationsService.getSimilarContent({ contentId: 'c-1', page: 1, limit: 10 });
    expect(result.totalCount).toBe(1);
    expect(result.items[0].title).toBe('Similar Movie');
  });

  it('getPopularContent returns popular recommendations list', async () => {
    vi.spyOn(mockRepo, 'getPopularContent').mockResolvedValueOnce({
      items: [] as any,
      total: 0,
    });

    const result = await recommendationsService.getPopularContent();
    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(1);
  });

  it('getTrendingContent returns trending recommendations', async () => {
    vi.spyOn(mockRepo, 'getTrendingContent').mockResolvedValueOnce({
      items: [] as any,
      total: 0,
    });

    const result = await recommendationsService.getTrendingContent();
    expect(result.totalCount).toBe(0);
  });

  it('getTopRatedContent filters minimum reviews', async () => {
    vi.spyOn(mockRepo, 'getTopRatedContent').mockResolvedValueOnce({
      items: [] as any,
      total: 0,
    });

    const result = await recommendationsService.getTopRatedContent({ minimumReviews: 5 });
    expect(result.totalCount).toBe(0);
  });

  it('getContinueDiscovering returns personalized un-interacted content', async () => {
    vi.spyOn(mockRepo, 'getContinueDiscovering').mockResolvedValueOnce({
      items: [] as any,
      total: 0,
    });

    const result = await recommendationsService.getContinueDiscovering('user-1');
    expect(result.totalCount).toBe(0);
  });
});
