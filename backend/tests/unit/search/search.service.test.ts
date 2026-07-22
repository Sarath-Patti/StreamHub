import { describe, it, expect, vi } from 'vitest';
import { SearchService } from '@/modules/search/service/search.service';
import { SearchRepository } from '@/modules/search/repository/search.repository';

describe('SearchService Unit Tests', () => {
  const mockSearchRepo = {
    search: vi.fn(),
    advancedSearch: vi.fn(),
    filterByGenre: vi.fn(),
    filterByType: vi.fn(),
    filterByLanguage: vi.fn(),
    filterByReleaseYear: vi.fn(),
    getTrending: vi.fn(),
    getRecentlyAdded: vi.fn(),
  } as unknown as SearchRepository;

  const searchService = new SearchService(mockSearchRepo);

  it('search formats metadata and pagination correctly', async () => {
    const mockItems = [
      {
        id: 'c-1',
        title: 'Inception',
        description: 'A mind-bending thriller',
        type: 'MOVIE',
        releaseYear: 2010,
        language: 'English',
        rating: 8.8,
        isTrending: true,
        genres: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.spyOn(mockSearchRepo, 'advancedSearch').mockResolvedValueOnce({
      items: mockItems as any,
      total: 35,
    });

    const result = await searchService.search({ query: 'Inception', page: 2, limit: 10 });
    expect(result.totalCount).toBe(35);
    expect(result.totalPages).toBe(4);
    expect(result.currentPage).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.results[0].title).toBe('Inception');
  });

  it('search handles empty results gracefully', async () => {
    vi.spyOn(mockSearchRepo, 'advancedSearch').mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    const result = await searchService.search({ query: 'NonExistentTitle' });
    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.results).toHaveLength(0);
  });

  it('getTrending returns formatted trending list', async () => {
    vi.spyOn(mockSearchRepo, 'getTrending').mockResolvedValueOnce([
      {
        id: 'c-2',
        title: 'Trending Movie',
        description: 'Popular',
        type: 'MOVIE',
        releaseYear: 2024,
        language: 'English',
        rating: 9.0,
        isTrending: true,
        genres: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any);

    const items = await searchService.getTrending(5);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Trending Movie');
  });
});
