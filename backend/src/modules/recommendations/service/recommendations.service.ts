import { RecommendationsRepository, recommendationsRepository as defaultRepo } from '../repository/recommendations.repository';
import { CatalogRepository, catalogRepository as defaultCatalogRepo } from '@/modules/catalog/repository/catalog.repository';
import {
  SimilarContentOptionsDTO,
  RecommendationPaginationOptionsDTO,
  TopRatedOptionsDTO,
  RecommendationResponseDTO,
} from '../types';
import { similarContentSchema, recommendationPaginationSchema, topRatedSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { NotFoundError } from '@/shared/errors';
import { ContentDTO, ContentTypeEnum } from '@/modules/catalog/types';
import { Content, Genre } from '@prisma/client';

export class RecommendationsService {
  constructor(
    private repo: RecommendationsRepository = defaultRepo,
    private catalogRepo: CatalogRepository = defaultCatalogRepo
  ) {}

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
      genres: content.genres
        ? content.genres.map((g) => ({
            id: g.id,
            name: g.name,
            createdAt: g.createdAt.toISOString(),
            updatedAt: g.updatedAt.toISOString(),
          }))
        : [],
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    };
  }

  private buildResponse(items: (Content & { genres?: Genre[] })[], total: number, page: number, limit: number): RecommendationResponseDTO {
    const totalPages = Math.ceil(total / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items: items.map((item) => this.formatContent(item)),
      totalCount: total,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };
  }

  public async getSimilarContent(options: SimilarContentOptionsDTO): Promise<RecommendationResponseDTO> {
    const validated = validateInput(similarContentSchema, options);
    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;

    const contentExists = await this.catalogRepo.findById(validated.contentId);
    if (!contentExists) {
      throw new NotFoundError(`Content with ID "${validated.contentId}" not found`);
    }

    const { items, total } = await this.repo.getSimilarContent(validated.contentId, { page, limit });
    return this.buildResponse(items, total, page, limit);
  }

  public async getPopularContent(options: RecommendationPaginationOptionsDTO = {}): Promise<RecommendationResponseDTO> {
    const validated = validateInput(recommendationPaginationSchema, options);
    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;

    const { items, total } = await this.repo.getPopularContent({ page, limit });
    return this.buildResponse(items, total, page, limit);
  }

  public async getTrendingContent(options: RecommendationPaginationOptionsDTO = {}): Promise<RecommendationResponseDTO> {
    const validated = validateInput(recommendationPaginationSchema, options);
    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;

    const { items, total } = await this.repo.getTrendingContent({ page, limit });
    return this.buildResponse(items, total, page, limit);
  }

  public async getTopRatedContent(options: TopRatedOptionsDTO = {}): Promise<RecommendationResponseDTO> {
    const validated = validateInput(topRatedSchema, options);
    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;
    const minimumReviews = validated.minimumReviews ?? 0;

    const { items, total } = await this.repo.getTopRatedContent({ page, limit, minimumReviews });
    return this.buildResponse(items, total, page, limit);
  }

  public async getContinueDiscovering(userId: string, options: RecommendationPaginationOptionsDTO = {}): Promise<RecommendationResponseDTO> {
    const validated = validateInput(recommendationPaginationSchema, options);
    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;

    const { items, total } = await this.repo.getContinueDiscovering(userId, { page, limit });
    return this.buildResponse(items, total, page, limit);
  }
}

export const recommendationsService = new RecommendationsService();
