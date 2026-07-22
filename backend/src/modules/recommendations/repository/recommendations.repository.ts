import { prisma } from '@/config/prisma';
import { Content, Genre } from '@prisma/client';

export class RecommendationsRepository {
  async getSimilarContent(
    contentId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const target = await prisma.content.findUnique({
      where: { id: contentId },
      include: { genres: true },
    });

    if (!target) {
      return { items: [], total: 0 };
    }

    const genreIds = target.genres.map((g) => g.id);

    const candidates = await prisma.content.findMany({
      where: {
        id: { not: contentId },
      },
      include: {
        genres: true,
      },
    });

    const minYear = target.releaseYear - 5;
    const maxYear = target.releaseYear + 5;
    const targetRating = target.rating ?? 5.0;

    const scored = candidates.map((item) => {
      let score = 0;
      const sharedGenres = item.genres.filter((g) => genreIds.includes(g.id)).length;
      score += sharedGenres * 3;

      if (item.type === target.type) {
        score += 2;
      }

      if (item.releaseYear >= minYear && item.releaseYear <= maxYear) {
        score += 1;
      }

      const itemRating = item.rating ?? 5.0;
      const ratingDiff = Math.abs(itemRating - targetRating);
      if (ratingDiff <= 1.5) {
        score += 1;
      }

      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score || (b.item.rating ?? 0) - (a.item.rating ?? 0));

    const total = scored.length;
    const skip = (page - 1) * limit;
    const items = scored.slice(skip, skip + limit).map((s) => s.item);

    return { items, total };
  }

  async getPopularContent(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const contents = await prisma.content.findMany({
      include: {
        genres: true,
        _count: {
          select: {
            reviews: true,
            watchlists: true,
          },
        },
      },
    });

    const scored = contents.map((item) => {
      const reviewCount = item._count.reviews;
      const watchlistCount = item._count.watchlists;
      const rating = item.rating ?? 0;

      const popularScore = reviewCount * 2 + watchlistCount * 1.5 + rating * 3;
      return { item, popularScore };
    });

    scored.sort((a, b) => b.popularScore - a.popularScore);

    const total = scored.length;
    const skip = (page - 1) * limit;
    const items = scored.slice(skip, skip + limit).map((s) => s.item);

    return { items, total };
  }

  async getTrendingContent(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const contents = await prisma.content.findMany({
      include: {
        genres: true,
        reviews: {
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
        watchlists: {
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
      },
    });

    const currentYear = new Date().getFullYear();

    const scored = contents.map((item) => {
      const recentReviews = item.reviews.length;
      const recentWatchlists = item.watchlists.length;
      const recencyBonus = item.releaseYear >= currentYear - 1 ? 5 : 0;
      const isTrendingBonus = item.isTrending ? 10 : 0;

      const trendingScore = recentReviews * 3 + recentWatchlists * 2 + recencyBonus + isTrendingBonus;
      return { item, trendingScore };
    });

    scored.sort((a, b) => b.trendingScore - a.trendingScore);

    const total = scored.length;
    const skip = (page - 1) * limit;
    const items = scored.slice(skip, skip + limit).map((s) => s.item);

    return { items, total };
  }

  async getTopRatedContent(
    options: { page?: number; limit?: number; minimumReviews?: number } = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const minimumReviews = options.minimumReviews || 0;

    const contents = await prisma.content.findMany({
      include: {
        genres: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    const filtered = contents.filter((item) => item._count.reviews >= minimumReviews);
    filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const items = filtered.slice(skip, skip + limit);

    return { items, total };
  }

  async getContinueDiscovering(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const [userReviews, userWatchlists] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        include: {
          content: {
            include: { genres: true },
          },
        },
      }),
      prisma.watchlist.findMany({
        where: { userId },
        include: {
          content: {
            include: { genres: true },
          },
        },
      }),
    ]);

    const excludedIds = new Set<string>([
      ...userReviews.map((r) => r.contentId),
      ...userWatchlists.map((w) => w.contentId),
    ]);

    const userGenreCounts = new Map<string, number>();
    for (const r of userReviews) {
      for (const g of r.content.genres) {
        userGenreCounts.set(g.id, (userGenreCounts.get(g.id) || 0) + 1);
      }
    }
    for (const w of userWatchlists) {
      for (const g of w.content.genres) {
        userGenreCounts.set(g.id, (userGenreCounts.get(g.id) || 0) + 1);
      }
    }

    const candidateContents = await prisma.content.findMany({
      where: {
        id: {
          notIn: Array.from(excludedIds),
        },
      },
      include: {
        genres: true,
      },
    });

    const scored = candidateContents.map((item) => {
      let affinityScore = 0;
      for (const g of item.genres) {
        affinityScore += userGenreCounts.get(g.id) || 0;
      }

      const ratingScore = item.rating ?? 0;
      const totalScore = affinityScore * 3 + ratingScore;

      return { item, totalScore };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);

    const total = scored.length;
    const skip = (page - 1) * limit;
    const items = scored.slice(skip, skip + limit).map((s) => s.item);

    return { items, total };
  }
}

export const recommendationsRepository = new RecommendationsRepository();
