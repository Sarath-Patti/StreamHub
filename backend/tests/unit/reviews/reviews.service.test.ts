import { describe, it, expect, vi } from 'vitest';
import { ReviewsService } from '@/modules/reviews/service/reviews.service';
import { ReviewsRepository } from '@/modules/reviews/repository/reviews.repository';
import { CatalogRepository } from '@/modules/catalog/repository/catalog.repository';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/shared/errors';

describe('ReviewsService Unit Tests', () => {
  const mockReviewsRepo = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findByContent: vi.fn(),
    findByUser: vi.fn(),
    exists: vi.fn(),
    getAverageRating: vi.fn(),
    getRatingDistribution: vi.fn(),
  } as unknown as ReviewsRepository;

  const mockCatalogRepo = {
    findById: vi.fn(),
  } as unknown as CatalogRepository;

  const reviewsService = new ReviewsService(mockReviewsRepo, mockCatalogRepo);

  it('createReview throws NotFoundError if content does not exist', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce(null);

    await expect(
      reviewsService.createReview('user-1', { contentId: 'nonexistent', rating: 5 })
    ).rejects.toThrow(NotFoundError);
  });

  it('createReview throws ValidationError if user already reviewed content (duplicate prevention)', async () => {
    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce({ id: 'content-1' } as any);
    vi.spyOn(mockReviewsRepo, 'exists').mockResolvedValueOnce(true);

    await expect(
      reviewsService.createReview('user-1', { contentId: 'content-1', rating: 4 })
    ).rejects.toThrow(ValidationError);
  });

  it('createReview successfully creates review when valid', async () => {
    const mockUser = { id: 'user-1', name: 'John Doe' };
    const mockReview = {
      id: 'review-1',
      userId: 'user-1',
      contentId: 'content-1',
      rating: 5,
      review: 'Masterpiece!',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: mockUser,
    };

    vi.spyOn(mockCatalogRepo, 'findById').mockResolvedValueOnce({ id: 'content-1' } as any);
    vi.spyOn(mockReviewsRepo, 'exists').mockResolvedValueOnce(false);
    vi.spyOn(mockReviewsRepo, 'create').mockResolvedValueOnce(mockReview as any);

    const result = await reviewsService.createReview('user-1', {
      contentId: 'content-1',
      rating: 5,
      review: 'Masterpiece!',
    });

    expect(result.id).toBe('review-1');
    expect(result.rating).toBe(5);
    expect(result.user.name).toBe('John Doe');
  });

  it('updateReview throws UnauthorizedError if modifying another user review', async () => {
    vi.spyOn(mockReviewsRepo, 'findById').mockResolvedValueOnce({
      id: 'review-1',
      userId: 'other-user',
    } as any);

    await expect(
      reviewsService.updateReview('user-1', 'review-1', { rating: 3 })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deleteReview throws UnauthorizedError if deleting another user review', async () => {
    vi.spyOn(mockReviewsRepo, 'findById').mockResolvedValueOnce({
      id: 'review-1',
      userId: 'other-user',
    } as any);

    await expect(reviewsService.deleteReview('user-1', 'review-1')).rejects.toThrow(UnauthorizedError);
  });

  it('getAverageRating returns calculated score', async () => {
    vi.spyOn(mockReviewsRepo, 'getAverageRating').mockResolvedValueOnce(4.5);

    const score = await reviewsService.getAverageRating('content-1');
    expect(score).toBe(4.5);
  });

  it('getRatingDistribution returns star distribution object', async () => {
    const mockDistribution = { star1: 0, star2: 1, star3: 2, star4: 5, star5: 10 };
    vi.spyOn(mockReviewsRepo, 'getRatingDistribution').mockResolvedValueOnce(mockDistribution);

    const dist = await reviewsService.getRatingDistribution('content-1');
    expect(dist.star5).toBe(10);
  });
});
