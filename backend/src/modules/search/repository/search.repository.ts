import { prisma } from '@/config/prisma';
import { Content, Genre, ContentType, Prisma } from '@prisma/client';
import { SearchInputDTO } from '../types';
import { ContentTypeEnum } from '@/modules/catalog/types';

export class SearchRepository {
  async search(options: SearchInputDTO): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.advancedSearch(options);
  }

  async advancedSearch(options: SearchInputDTO): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {};

    if (options.query && options.query.trim() !== '') {
      const q = options.query.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (options.type) {
      where.type = options.type as ContentType;
    }

    if (options.language) {
      where.language = { equals: options.language, mode: 'insensitive' };
    }

    if (options.releaseYear) {
      where.releaseYear = options.releaseYear;
    }

    if (options.minimumRating !== undefined && options.minimumRating !== null) {
      where.rating = { gte: options.minimumRating };
    }

    if (options.genre && options.genre.trim() !== '') {
      const g = options.genre.trim();
      where.genres = {
        some: {
          OR: [
            { id: g },
            { name: { equals: g, mode: 'insensitive' } },
          ],
        },
      };
    }

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    const orderBy: Prisma.ContentOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          genres: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return { items, total };
  }

  async filterByGenre(genre: string, options: SearchInputDTO = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.advancedSearch({ ...options, genre });
  }

  async filterByType(type: ContentType, options: SearchInputDTO = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.advancedSearch({ ...options, type: type as ContentTypeEnum });
  }

  async filterByLanguage(language: string, options: SearchInputDTO = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.advancedSearch({ ...options, language });
  }

  async filterByReleaseYear(year: number, options: SearchInputDTO = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.advancedSearch({ ...options, releaseYear: year });
  }

  async getTrending(limit = 10): Promise<(Content & { genres: Genre[] })[]> {
    return prisma.content.findMany({
      where: { isTrending: true },
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        genres: true,
      },
    });
  }

  async getRecentlyAdded(limit = 10): Promise<(Content & { genres: Genre[] })[]> {
    return prisma.content.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        genres: true,
      },
    });
  }
}

export const searchRepository = new SearchRepository();
