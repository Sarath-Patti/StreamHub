import { prisma } from '@/config/prisma';
import { Content, Genre, Review, User } from '@prisma/client';
import { AdminPaginationOptionsDTO } from '../types';

export class AdminRepository {
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalContent: number;
    movies: number;
    series: number;
    reviews: number;
    watchlists: number;
    trendingItems: number;
    topRatedItems: number;
    newestContent: (Content & { genres: Genre[] })[];
  }> {
    const [
      totalUsers,
      totalContent,
      movies,
      series,
      reviews,
      watchlists,
      trendingItems,
      topRatedItems,
      newestContent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.content.count({ where: { isDeleted: false } }),
      prisma.content.count({ where: { type: 'MOVIE', isDeleted: false } }),
      prisma.content.count({ where: { type: 'SERIES', isDeleted: false } }),
      prisma.review.count(),
      prisma.watchlist.count(),
      prisma.content.count({ where: { isTrending: true, isDeleted: false } }),
      prisma.content.count({ where: { rating: { gte: 8.0 }, isDeleted: false } }),
      prisma.content.findMany({
        where: { isDeleted: false },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { genres: true },
      }),
    ]);

    return {
      totalUsers,
      totalContent,
      movies,
      series,
      reviews,
      watchlists,
      trendingItems,
      topRatedItems,
      newestContent,
    };
  }

  async softDeleteContent(id: string): Promise<Content & { genres: Genre[] }> {
    return prisma.content.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      include: { genres: true },
    });
  }

  async restoreContent(id: string): Promise<Content & { genres: Genre[] }> {
    return prisma.content.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      include: { genres: true },
    });
  }

  async bulkDeleteContent(ids: string[]): Promise<boolean> {
    await prisma.content.updateMany({
      where: { id: { in: ids } },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return true;
  }

  async bulkRestoreContent(ids: string[]): Promise<boolean> {
    await prisma.content.updateMany({
      where: { id: { in: ids } },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return true;
  }

  async findDeletedContent(
    options: AdminPaginationOptionsDTO = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where: { isDeleted: true },
        skip,
        take: limit,
        orderBy: { deletedAt: 'desc' },
        include: { genres: true },
      }),
      prisma.content.count({ where: { isDeleted: true } }),
    ]);

    return { items, total };
  }

  async findAllContentAdmin(
    options: AdminPaginationOptionsDTO = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;
    const where = options.includeDeleted ? {} : { isDeleted: false };

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { genres: true },
      }),
      prisma.content.count({ where }),
    ]);

    return { items, total };
  }

  async hideReview(id: string): Promise<Review & { user: User }> {
    return prisma.review.update({
      where: { id },
      data: { isHidden: true },
      include: { user: true },
    });
  }

  async restoreReview(id: string): Promise<Review & { user: User }> {
    return prisma.review.update({
      where: { id },
      data: { isHidden: false, isReported: false },
      include: { user: true },
    });
  }

  async deleteReviewAdmin(id: string): Promise<boolean> {
    await prisma.review.delete({
      where: { id },
    });
    return true;
  }

  async findReportedReviews(
    options: AdminPaginationOptionsDTO = {}
  ): Promise<{ items: (Review & { user: User })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      OR: [{ isReported: true }, { isHidden: true }],
    };

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { user: true },
      }),
      prisma.review.count({ where }),
    ]);

    return { items, total };
  }
}

export const adminRepository = new AdminRepository();
