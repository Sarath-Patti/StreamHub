import { prisma } from '@/config/prisma';
import { Content, Genre, ContentType, Prisma } from '@prisma/client';
import { QueryContentOptions, CreateContentInputDTO, UpdateContentInputDTO } from '../types';

export class CatalogRepository {
  async findById(id: string): Promise<(Content & { genres: Genre[] }) | null> {
    return prisma.content.findUnique({
      where: { id },
      include: {
        genres: true,
        seasons: {
          include: {
            episodes: {
              orderBy: { episodeNumber: 'asc' },
            },
          },
          orderBy: { seasonNumber: 'asc' },
        },
      },
    }) as Promise<(Content & { genres: Genre[] }) | null>;
  }

  async findAll(options: QueryContentOptions = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {};
    if (options.type) {
      where.type = options.type;
    }
    if (options.genreId) {
      where.genres = {
        some: { id: options.genreId },
      };
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput = {};
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    (orderBy as Record<string, 'asc' | 'desc'>)[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { genres: true },
      }),
      prisma.content.count({ where }),
    ]);

    return { items: items as (Content & { genres: Genre[] })[], total };
  }

  async search(query: string, options: QueryContentOptions = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
        include: { genres: true },
      }),
      prisma.content.count({ where }),
    ]);

    return { items: items as (Content & { genres: Genre[] })[], total };
  }

  async findTrending(limit = 10): Promise<(Content & { genres: Genre[] })[]> {
    return prisma.content.findMany({
      where: { isTrending: true },
      take: limit,
      orderBy: { rating: 'desc' },
      include: { genres: true },
    }) as Promise<(Content & { genres: Genre[] })[]>;
  }

  async findByGenre(genreId: string, options: QueryContentOptions = {}): Promise<{ items: (Content & { genres: Genre[] })[]; total: number }> {
    return this.findAll({ ...options, genreId });
  }

  async findAllGenres(): Promise<Genre[]> {
    return prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateContentInputDTO): Promise<Content & { genres: Genre[] }> {
    const { genreIds, type, ...rest } = data;
    const connectGenres = genreIds?.map((id) => ({ id })) || [];

    return prisma.content.create({
      data: {
        ...rest,
        type: type as ContentType,
        genres: {
          connect: connectGenres,
        },
      },
      include: { genres: true },
    }) as Promise<Content & { genres: Genre[] }>;
  }

  async update(id: string, data: UpdateContentInputDTO): Promise<Content & { genres: Genre[] }> {
    const { genreIds, type, ...rest } = data;

    const updateData: Prisma.ContentUpdateInput = {
      ...rest,
      ...(type ? { type: type as ContentType } : {}),
    };

    if (genreIds) {
      updateData.genres = {
        set: genreIds.map((gId) => ({ id: gId })),
      };
    }

    return prisma.content.update({
      where: { id },
      data: updateData,
      include: { genres: true },
    }) as Promise<Content & { genres: Genre[] }>;
  }

  async delete(id: string): Promise<boolean> {
    await prisma.content.delete({
      where: { id },
    });
    return true;
  }
}

export const catalogRepository = new CatalogRepository();
