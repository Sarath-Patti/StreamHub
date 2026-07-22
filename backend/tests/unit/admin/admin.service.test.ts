import { describe, it, expect, vi } from 'vitest';
import { AdminService } from '@/modules/admin/service/admin.service';
import { AdminRepository } from '@/modules/admin/repository/admin.repository';
import { CatalogService } from '@/modules/catalog/service/catalog.service';
import { ReviewsService } from '@/modules/reviews/service/reviews.service';
import { UnauthorizedError } from '@/shared/errors';

describe('AdminService Unit Tests', () => {
  const mockAdminRepo = {
    getDashboardStats: vi.fn(),
    softDeleteContent: vi.fn(),
    restoreContent: vi.fn(),
    bulkDeleteContent: vi.fn(),
    bulkRestoreContent: vi.fn(),
    findDeletedContent: vi.fn(),
    findAllContentAdmin: vi.fn(),
    hideReview: vi.fn(),
    restoreReview: vi.fn(),
    deleteReviewAdmin: vi.fn(),
    findReportedReviews: vi.fn(),
  } as unknown as AdminRepository;

  const mockCatalogService = {
    getContentById: vi.fn(),
    formatContent: vi.fn((x) => x as any),
    createContent: vi.fn(),
    updateContent: vi.fn(),
  } as unknown as CatalogService;

  const mockReviewsService = {
    formatReview: vi.fn((x) => x as any),
  } as unknown as ReviewsService;

  const adminService = new AdminService(mockAdminRepo, mockCatalogService, mockReviewsService);

  const adminUser = { role: 'ADMIN' };
  const normalUser = { role: 'USER' };

  it('requireAdmin throws UnauthorizedError if user is null or role is USER', () => {
    expect(() => adminService.requireAdmin(null)).toThrow(UnauthorizedError);
    expect(() => adminService.requireAdmin(normalUser)).toThrow(UnauthorizedError);
    expect(() => adminService.requireAdmin(adminUser)).not.toThrow();
  });

  it('getDashboardStats fails for non-admin and succeeds for ADMIN', async () => {
    await expect(adminService.getDashboardStats(normalUser)).rejects.toThrow(UnauthorizedError);

    vi.spyOn(mockAdminRepo, 'getDashboardStats').mockResolvedValueOnce({
      totalUsers: 10,
      totalContent: 5,
      movies: 3,
      series: 2,
      reviews: 8,
      watchlists: 12,
      trendingItems: 1,
      topRatedItems: 2,
      newestContent: [],
    });

    const stats = await adminService.getDashboardStats(adminUser);
    expect(stats.totalUsers).toBe(10);
    expect(stats.movies).toBe(3);
  });

  it('softDeleteContent soft deletes item for admin', async () => {
    vi.spyOn(mockCatalogService, 'getContentById').mockResolvedValueOnce({ id: 'c-1' } as any);
    vi.spyOn(mockAdminRepo, 'softDeleteContent').mockResolvedValueOnce({ id: 'c-1' } as any);

    const result = await adminService.softDeleteContent(adminUser, 'c-1');
    expect(result).toBe(true);
  });

  it('bulkDeleteContent executes bulk deletion', async () => {
    vi.spyOn(mockAdminRepo, 'bulkDeleteContent').mockResolvedValueOnce(true);

    const result = await adminService.bulkDeleteContent(adminUser, { ids: ['c-1', 'c-2'] });
    expect(result).toBe(true);
  });

  it('hideReview hides review for admin', async () => {
    vi.spyOn(mockAdminRepo, 'hideReview').mockResolvedValueOnce({ id: 'r-1', isHidden: true } as any);

    const result = await adminService.hideReview(adminUser, 'r-1');
    expect(result.id).toBe('r-1');
  });
});
