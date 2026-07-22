import { prisma } from '@/config/prisma';
import { Watchlist, Content, Genre } from '@prisma/client';
import { QueryWatchlistOptions } from '../types';

export class WatchlistRepository {
  async add(userId: string, contentId: string): Promise<Watchlist & { content: Content & { genres: Genre[] } }> {
    return prisma.watchlist.create({
      data: {
        userId,
        contentId,
      },
      include: {
        content: {
          include: {
            genres: true,
          },
        },
      },
    }) as Promise<Watchlist & { content: Content & { genres: Genre[] } }>;
  }

  async remove(userId: string, contentId: string): Promise<boolean> {
    const entry = await prisma.watchlist.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    if (!entry) {
      return false;
    }

    await prisma.watchlist.delete({
      where: {
        id: entry.id,
      },
    });

    return true;
  }

  async exists(userId: string, contentId: string): Promise<boolean> {
    const count = await prisma.watchlist.count({
      where: {
        userId,
        contentId,
      },
    });
    return count > 0;
  }

  async findByUser(
    userId: string,
    options: QueryWatchlistOptions = {}
  ): Promise<{ items: (Watchlist & { content: Content & { genres: Genre[] } })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.watchlist.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          content: {
            include: {
              genres: true,
            },
          },
        },
      }),
      prisma.watchlist.count({ where: { userId } }),
    ]);

    return {
      items: items as (Watchlist & { content: Content & { genres: Genre[] } })[],
      total,
    };
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.watchlist.count({
      where: { userId },
    });
  }
}

export const watchlistRepository = new WatchlistRepository();
