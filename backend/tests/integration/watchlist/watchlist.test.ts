import { describe, it, expect, vi } from 'vitest';
import { watchlistResolvers } from '@/modules/watchlist/graphql/resolvers';
import { watchlistService } from '@/modules/watchlist/service/watchlist.service';
import { UnauthorizedError } from '@/shared/errors';

describe('Watchlist Integration & Resolver Tests', () => {
  it('myWatchlist query throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(watchlistResolvers.Query.myWatchlist({}, {}, context)).rejects.toThrow(UnauthorizedError);
  });

  it('watchlistCount query throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(watchlistResolvers.Query.watchlistCount({}, {}, context)).rejects.toThrow(UnauthorizedError);
  });

  it('myWatchlist query calls watchlistService for authenticated user', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com', role: 'USER' };
    const context = { user: mockUser } as any;

    vi.spyOn(watchlistService, 'getUserWatchlist').mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await watchlistResolvers.Query.myWatchlist({}, { page: 1, limit: 20 }, context);
    expect(result.total).toBe(0);
  });

  it('addToWatchlist mutation throws UnauthorizedError when context user is null', async () => {
    const context = { user: null } as any;
    await expect(
      watchlistResolvers.Mutation.addToWatchlist({}, { contentId: 'content-1' }, context)
    ).rejects.toThrow(UnauthorizedError);
  });
});
