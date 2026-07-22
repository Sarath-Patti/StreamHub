import { describe, it, expect, vi } from 'vitest';
import { adminResolvers } from '@/modules/admin/graphql/resolvers';
import { adminService } from '@/modules/admin/service/admin.service';
import { UnauthorizedError } from '@/shared/errors';

describe('Admin Integration & Resolver Tests', () => {
  it('adminDashboard query throws UnauthorizedError for unauthenticated or non-admin user', async () => {
    const contextNormal = { user: { role: 'USER' } } as any;
    await expect(adminResolvers.Query.adminDashboard({}, {}, contextNormal)).rejects.toThrow(UnauthorizedError);
  });

  it('adminDashboard query returns stats for ADMIN user', async () => {
    const contextAdmin = { user: { role: 'ADMIN' } } as any;
    vi.spyOn(adminService, 'getDashboardStats').mockResolvedValueOnce({
      totalUsers: 100,
      totalContent: 50,
      movies: 30,
      series: 20,
      reviews: 200,
      watchlists: 150,
      trendingItems: 10,
      topRatedItems: 15,
      newestContent: [],
    });

    const stats = await adminResolvers.Query.adminDashboard({}, {}, contextAdmin);
    expect(stats.totalUsers).toBe(100);
  });

  it('restoreContent mutation throws UnauthorizedError for non-admin', async () => {
    const contextUser = { user: { role: 'USER' } } as any;
    await expect(adminResolvers.Mutation.restoreContent({}, { id: 'c-1' }, contextUser)).rejects.toThrow(UnauthorizedError);
  });

  it('bulkDeleteContent mutation executes for ADMIN user', async () => {
    const contextAdmin = { user: { role: 'ADMIN' } } as any;
    vi.spyOn(adminService, 'bulkDeleteContent').mockResolvedValueOnce(true);

    const result = await adminResolvers.Mutation.bulkDeleteContent({}, { ids: ['c-1', 'c-2'] }, contextAdmin);
    expect(result).toBe(true);
  });
});
