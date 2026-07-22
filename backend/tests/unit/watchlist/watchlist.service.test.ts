import { describe, it, expect, vi } from 'vitest';
import { WatchlistService } from '@/modules/watchlist/service/watchlist.service';
import { WatchlistRepository } from '@/modules/watchlist/repository/watchlist.repository';
import { CatalogRepository } from '@/modules/catalog/repository/catalog.repository';
import { NotFoundError, ValidationError } from '@/shared/errors';

describe('WatchlistService Unit Tests', () => {
  const mockWatchlistRepo = {
    add: vi.fn(),
    remove: vi.fn(),
    exists: vi.fn(),
    findByUser: vi.fn(),
    countByUser: vi.fn(),
  } as unknown as WatchlistRepository;

  const mockCatalogRepo = {
    findById: vi.fn(),
  } as unknown as CatalogRepository;

  const watchlistService = new WatchlistService(mockWatchlistRepo, mockCatalogRepo);

  it('addToWatchlist throws NotFoundError if content does not exist', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce(null);

    await expect(watchlistService.addToWatchlist('user-1', 'nonexistent-content')).rejects.toThrow(NotFoundError);
  });

  it('addToWatchlist throws ValidationError if item is already in watchlist (duplicate prevention)', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce({ id: 'content-1' } as any);
    vi.spyOn(mockWatchlistRepo, 'exists').mockResolvedValueOnce(true);

    await expect(watchlistService.addToWatchlist('user-1', 'content-1')).rejects.toThrow(ValidationError);
  });

  it('addToWatchlist successfully adds content to watchlist', async () => {
    const mockContent = {
      id: 'content-1',
      title: 'Inception',
      description: 'A mind-bending thriller',
      type: 'MOVIE',
      releaseYear: 2010,
      duration: 148,
      language: 'English',
      rating: 8.8,
      posterUrl: null,
      bannerUrl: null,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      genres: [],
    };

    const mockItem = {
      id: 'watchlist-entry-1',
      userId: 'user-1',
      contentId: 'content-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: mockContent,
    };

    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce(mockContent as any);
    vi.spyOn(mockWatchlistRepo, 'exists').mockResolvedValueOnce(false);
    vi.spyOn(mockWatchlistRepo, 'add').mockResolvedValueOnce(mockItem as any);

    const result = await watchlistService.addToWatchlist('user-1', 'content-1');
    expect(result.id).toBe('watchlist-entry-1');
    expect(result.content.title).toBe('Inception');
  });

  it('removeFromWatchlist throws NotFoundError if entry does not exist', async () => {
    vi.spyOn(mockWatchlistRepo, 'remove').mockResolvedValueOnce(false);

    await expect(watchlistService.removeFromWatchlist('user-1', 'content-99')).rejects.toThrow(NotFoundError);
  });

  it('removeFromWatchlist successfully removes content from watchlist', async () => {
    vi.spyOn(mockWatchlistRepo, 'remove').mockResolvedValueOnce(true);

    const result = await watchlistService.removeFromWatchlist('user-1', 'content-1');
    expect(result).toBe(true);
  });

  it('getUserWatchlist calculates pagination correctly', async () => {
    vi.spyOn(mockWatchlistRepo, 'findByUser').mockResolvedValueOnce({
      items: [],
      total: 25,
    });

    const result = await watchlistService.getUserWatchlist('user-1', { page: 2, limit: 10 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
  });
});
