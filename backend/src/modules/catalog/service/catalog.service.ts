import { CatalogRepository, catalogRepository as defaultRepo } from '../repository/catalog.repository';
import {
  ContentDTO,
  ContentConnectionDTO,
  CreateContentInputDTO,
  UpdateContentInputDTO,
  QueryContentOptions,
  GenreDTO,
  ContentTypeEnum,
} from '../types';
import { createContentSchema, updateContentSchema, paginationQuerySchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { NotFoundError } from '@/shared/errors';
import { Content, Genre } from '@prisma/client';

export class CatalogService {
  constructor(private repo: CatalogRepository = defaultRepo) {}

  public formatGenre(genre: Genre): GenreDTO {
    return {
      id: genre.id,
      name: genre.name,
      createdAt: genre.createdAt.toISOString(),
      updatedAt: genre.updatedAt.toISOString(),
    };
  }

  public formatContent(content: Content & { genres?: Genre[] }): ContentDTO {
    return {
      id: content.id,
      title: content.title,
      description: content.description,
      type: content.type as ContentTypeEnum,
      releaseYear: content.releaseYear,
      duration: content.duration,
      language: content.language,
      rating: content.rating,
      posterUrl: content.posterUrl,
      bannerUrl: content.bannerUrl,
      isTrending: content.isTrending,
      genres: content.genres ? content.genres.map(this.formatGenre) : [],
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    };
  }

  public async getContentById(id: string): Promise<ContentDTO> {
    const content = await this.repo.findById(id);
    if (!content) {
      throw new NotFoundError(`Content with ID "${id}" not found`);
    }
    return this.formatContent(content);
  }

  public async getContents(options: QueryContentOptions = {}): Promise<ContentConnectionDTO> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    validateInput(paginationQuerySchema, { page, limit });

    const { items, total } = await this.repo.findAll({ ...options, page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.formatContent(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async searchContent(query: string, page = 1, limit = 20): Promise<ContentConnectionDTO> {
    validateInput(paginationQuerySchema, { page, limit });
    const { items, total } = await this.repo.search(query, { page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.formatContent(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async getTrendingContent(limit = 10): Promise<ContentDTO[]> {
    const items = await this.repo.findTrending(limit);
    return items.map((item) => this.formatContent(item));
  }

  public async getRecentlyAdded(limit = 10): Promise<ContentDTO[]> {
    const { items } = await this.repo.findAll({ page: 1, limit, sortBy: 'createdAt', sortOrder: 'desc' });
    return items.map((item) => this.formatContent(item));
  }

  public async getAllGenres(): Promise<GenreDTO[]> {
    const genres = await this.repo.findAllGenres();
    return genres.map(this.formatGenre);
  }

  public async createContent(input: CreateContentInputDTO): Promise<ContentDTO> {
    const validated = validateInput(createContentSchema, input);
    const content = await this.repo.create(validated as CreateContentInputDTO);
    return this.formatContent(content);
  }

  public async updateContent(id: string, input: UpdateContentInputDTO): Promise<ContentDTO> {
    const validated = validateInput(updateContentSchema, input);
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Content with ID "${id}" not found`);
    }

    const updated = await this.repo.update(id, validated as UpdateContentInputDTO);
    return this.formatContent(updated);
  }

  public async deleteContent(id: string): Promise<boolean> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Content with ID "${id}" not found`);
    }
    return this.repo.delete(id);
  }
}

export const catalogService = new CatalogService();
