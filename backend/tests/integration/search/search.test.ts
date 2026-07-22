import { describe, it, expect, vi } from 'vitest';
import { searchResolvers } from '@/modules/search/graphql/resolvers';
import { searchService } from '@/modules/search/service/search.service';

describe('Search Integration & Resolver Tests', () => {
  it('search query delegates to searchService', async () => {
    vi.spyOn(searchService, 'search').mockResolvedValueOnce({
      results: [
        {
          id: 'c-1',
          title: 'Search Result Movie',
          description: 'Desc',
          type: 'MOVIE',
          releaseYear: 2023,
          language: 'English',
          isTrending: false,
          genres: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    const result = await searchResolvers.Query.search({}, { input: { query: 'Result' } });
    expect(result.totalCount).toBe(1);
    expect(result.results[0].title).toBe('Search Result Movie');
  });

  it('discover query returns discovery results', async () => {
    vi.spyOn(searchService, 'discover').mockResolvedValueOnce({
      results: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    const result = await searchResolvers.Query.discover({}, { input: { genre: 'Sci-Fi' } });
    expect(result.totalCount).toBe(0);
  });

  it('trending query returns top content', async () => {
    vi.spyOn(searchService, 'getTrending').mockResolvedValueOnce([]);

    const result = await searchResolvers.Query.trending({}, { limit: 5 });
    expect(result).toHaveLength(0);
  });
});
