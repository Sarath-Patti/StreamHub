import { prisma } from '@/config/prisma';
import { Review, User, Content, Genre, Prisma } from '@prisma/client';
import { QueryReviewsOptions, RatingDistributionDTO } from '../types';

export class ReviewsRepository {
  async create(data: {
    userId: string;
    contentId: string;
    rating: number;
    review?: string | null;
  }): Promise<Review & { user: User }> {
    return prisma.review.create({
      data: {
        userId: data.userId,
        contentId: data.contentId,
        rating: data.rating,
        review: data.review,
      },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    data: { rating?: number; review?: string | null }
  ): Promise<Review & { user: User }> {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.review.delete({
      where: { id },
    });
    return true;
  }

  async findById(id: string): Promise<(Review & { user: User }) | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByContent(
    contentId: string,
    options: QueryReviewsOptions = {}
  ): Promise<{ items: (Review & { user: User })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.ReviewOrderByWithRelationInput =
      options.sortBy === 'highest' ? { rating: 'desc' } : { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { contentId },
        skip,
        take: limit,
        orderBy,
        include: {
          user: true,
        },
      }),
      prisma.review.count({ where: { contentId } }),
    ]);

    return { items, total };
  }

  async findByUser(
    userId: string,
    options: QueryReviewsOptions = {}
  ): Promise<{ items: (Review & { user: User; content: Content & { genres: Genre[] } })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          content: {
            include: {
              genres: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    return {
      items: items as (Review & { user: User; content: Content & { genres: Genre[] } })[],
      total,
    };
  }

  async exists(userId: string, contentId: string): Promise<boolean> {
    const count = await prisma.review.count({
      where: {
        userId,
        contentId,
      },
    });
    return count > 0;
  }

  async getAverageRating(contentId: string): Promise<number> {
    const aggregate = await prisma.review.aggregate({
      where: { contentId },
      _avg: {
        rating: true,
      },
    });

    return aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0;
  }

  async getRatingDistribution(contentId: string): Promise<RatingDistributionDTO> {
    const group = await prisma.review.groupBy({
      by: ['rating'],
      where: { contentId },
      _count: {
        rating: true,
      },
    });

    const distribution: RatingDistributionDTO = {
      star1: 0,
      star2: 0,
      star3: 0,
      star4: 0,
      star5: 0,
    };

    for (const item of group) {
      if (item.rating >= 1 && item.rating <= 5) {
        const key = `star${item.rating}` as keyof RatingDistributionDTO;
        distribution[key] = item._count.rating;
      }
    }

    return distribution;
  }
}

export const reviewsRepository = new ReviewsRepository();
