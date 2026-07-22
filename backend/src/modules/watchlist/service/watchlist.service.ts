import { WatchlistRepository, watchlistRepository as defaultRepo } from '../repository/watchlist.repository';
import { CatalogRepository, catalogRepository as defaultCatalogRepo } from '@/modules/catalog/repository/catalog.repository';
import { WatchlistItemDTO, WatchlistConnectionDTO, QueryWatchlistOptions } from '../types';
import { addToWatchlistSchema, removeFromWatchlistSchema, watchlistPaginationSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { NotFoundError, ValidationError } from '@/shared/errors';
import { Watchlist, Content, Genre } from '@prisma/client';
import { ContentTypeEnum } from '@/modules/catalog/types';

export class WatchlistService {
  constructor(
    private repo: WatchlistRepository = defaultRepo,
    private catalogRepo: CatalogRepository = defaultCatalogRepo
  ) {}

  public formatWatchlistItem(item: Watchlist & { content: Content & { genres?: Genre[] } }): WatchlistItemDTO {
    return {
      id: item.id,
      userId: item.userId,
      contentId: item.contentId,
      content: {
        id: item.content.id,
        title: item.content.title,
        description: item.content.description,
        type: item.content.type as ContentTypeEnum,
        releaseYear: item.content.releaseYear,
        duration: item.content.duration,
        language: item.content.language,
        rating: item.content.rating,
        posterUrl: item.content.posterUrl,
        bannerUrl: item.content.bannerUrl,
        isTrending: item.content.isTrending,
        genres: item.content.genres
          ? item.content.genres.map((g) => ({
              id: g.id,
              name: g.name,
              createdAt: g.createdAt.toISOString(),
              updatedAt: g.updatedAt.toISOString(),
            }))
          : [],
        createdAt: item.content.createdAt.toISOString(),
        updatedAt: item.content.updatedAt.toISOString(),
      },
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  public async addToWatchlist(userId: string, contentId: string): Promise<WatchlistItemDTO> {
    validateInput(addToWatchlistSchema, { contentId });

    const contentExists = await this.catalogRepo.findById(contentId);
    if (!contentExists) {
      throw new NotFoundError(`Content with ID "${contentId}" not found`);
    }

    const alreadyInWatchlist = await this.repo.exists(userId, contentId);
    if (alreadyInWatchlist) {
      throw new ValidationError('Content is already in your watchlist');
    }

    const item = await this.repo.add(userId, contentId);
    return this.formatWatchlistItem(item);
  }

  public async removeFromWatchlist(userId: string, contentId: string): Promise<boolean> {
    validateInput(removeFromWatchlistSchema, { contentId });

    const removed = await this.repo.remove(userId, contentId);
    if (!removed) {
      throw new NotFoundError(`Watchlist entry for content ID "${contentId}" not found`);
    }

    return true;
  }

  public async getUserWatchlist(userId: string, options: QueryWatchlistOptions = {}): Promise<WatchlistConnectionDTO> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    validateInput(watchlistPaginationSchema, { page, limit });

    const { items, total } = await this.repo.findByUser(userId, { page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.formatWatchlistItem(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async getWatchlistCount(userId: string): Promise<number> {
    return this.repo.countByUser(userId);
  }
}

export const watchlistService = new WatchlistService();
