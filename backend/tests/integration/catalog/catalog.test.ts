import { describe, it, expect, vi } from 'vitest';
import { catalogResolvers } from '@/modules/catalog/graphql/resolvers';
import { catalogService } from '@/modules/catalog/service/catalog.service';

describe('Catalog Integration & Resolver Tests', () => {
  it('contents query resolves paginated items', async () => {
    vi.spyOn(catalogService, 'getContents').mockResolvedValueOnce({
      items: [
        {
          id: '1',
          title: 'Test Movie',
          description: 'Description',
          type: 'MOVIE',
          releaseYear: 2024,
          language: 'English',
          isTrending: false,
          genres: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await catalogResolvers.Query.contents({}, { page: 1, limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Test Movie');
  });

  it('trendingContent query resolves list of trending content', async () => {
    vi.spyOn(catalogService, 'getTrendingContent').mockResolvedValueOnce([
      {
        id: '2',
        title: 'Trending Series',
        description: 'Popular TV Show',
        type: 'SERIES',
        releaseYear: 2023,
        language: 'English',
        isTrending: true,
        genres: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    const result = await catalogResolvers.Query.trendingContent({}, { limit: 10 });
    expect(result).toHaveLength(1);
    expect(result[0].isTrending).toBe(true);
  });
});
