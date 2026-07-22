import { ReviewsRepository, reviewsRepository as defaultRepo } from '../repository/reviews.repository';
import { CatalogRepository, catalogRepository as defaultCatalogRepo } from '@/modules/catalog/repository/catalog.repository';
import {
  ReviewDTO,
  UserReviewDTO,
  ReviewConnectionDTO,
  UserReviewConnectionDTO,
  CreateReviewInputDTO,
  UpdateReviewInputDTO,
  QueryReviewsOptions,
  RatingDistributionDTO,
} from '../types';
import { createReviewSchema, updateReviewSchema, deleteReviewSchema, reviewsPaginationSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/shared/errors';
import { Review, User, Content, Genre } from '@prisma/client';
import { ContentTypeEnum } from '@/modules/catalog/types';

export class ReviewsService {
  constructor(
    private repo: ReviewsRepository = defaultRepo,
    private catalogRepo: CatalogRepository = defaultCatalogRepo
  ) {}

  public formatReview(review: Review & { user: User }): ReviewDTO {
    return {
      id: review.id,
      userId: review.userId,
      contentId: review.contentId,
      user: {
        id: review.user.id,
        name: review.user.name,
      },
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  public formatUserReview(review: Review & { user: User; content: Content & { genres?: Genre[] } }): UserReviewDTO {
    return {
      id: review.id,
      userId: review.userId,
      contentId: review.contentId,
      content: {
        id: review.content.id,
        title: review.content.title,
        description: review.content.description,
        type: review.content.type as ContentTypeEnum,
        releaseYear: review.content.releaseYear,
        duration: review.content.duration,
        language: review.content.language,
        rating: review.content.rating,
        posterUrl: review.content.posterUrl,
        bannerUrl: review.content.bannerUrl,
        isTrending: review.content.isTrending,
        genres: review.content.genres
          ? review.content.genres.map((g) => ({
              id: g.id,
              name: g.name,
              createdAt: g.createdAt.toISOString(),
              updatedAt: g.updatedAt.toISOString(),
            }))
          : [],
        createdAt: review.content.createdAt.toISOString(),
        updatedAt: review.content.updatedAt.toISOString(),
      },
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  public async createReview(userId: string, input: CreateReviewInputDTO): Promise<ReviewDTO> {
    const validated = validateInput(createReviewSchema, input);

    const contentExists = await this.catalogRepo.findById(validated.contentId);
    if (!contentExists) {
      throw new NotFoundError(`Content with ID "${validated.contentId}" not found`);
    }

    const alreadyReviewed = await this.repo.exists(userId, validated.contentId);
    if (alreadyReviewed) {
      throw new ValidationError('You have already reviewed this content');
    }

    const review = await this.repo.create({
      userId,
      contentId: validated.contentId,
      rating: validated.rating,
      review: validated.review,
    });

    return this.formatReview(review);
  }

  public async updateReview(userId: string, id: string, input: UpdateReviewInputDTO): Promise<ReviewDTO> {
    const validated = validateInput(updateReviewSchema, input);

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Review with ID "${id}" not found`);
    }

    if (existing.userId !== userId) {
      throw new UnauthorizedError('You can only modify your own reviews');
    }

    const updated = await this.repo.update(id, validated);
    return this.formatReview(updated);
  }

  public async deleteReview(userId: string, id: string): Promise<boolean> {
    validateInput(deleteReviewSchema, { id });

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Review with ID "${id}" not found`);
    }

    if (existing.userId !== userId) {
      throw new UnauthorizedError('You can only modify your own reviews');
    }

    return this.repo.delete(id);
  }

  public async getReviewsByContent(contentId: string, options: QueryReviewsOptions = {}): Promise<ReviewConnectionDTO> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const sortBy = options.sortBy || 'newest';
    validateInput(reviewsPaginationSchema, { page, limit, sortBy });

    const { items, total } = await this.repo.findByContent(contentId, { page, limit, sortBy });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.formatReview(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async getUserReviews(userId: string, options: QueryReviewsOptions = {}): Promise<UserReviewConnectionDTO> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    validateInput(reviewsPaginationSchema, { page, limit });

    const { items, total } = await this.repo.findByUser(userId, { page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.formatUserReview(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async getAverageRating(contentId: string): Promise<number> {
    return this.repo.getAverageRating(contentId);
  }

  public async getRatingDistribution(contentId: string): Promise<RatingDistributionDTO> {
    return this.repo.getRatingDistribution(contentId);
  }
}

export const reviewsService = new ReviewsService();
