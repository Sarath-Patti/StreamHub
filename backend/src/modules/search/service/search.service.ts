import { SearchRepository, searchRepository as defaultRepo } from '../repository/search.repository';
import { SearchInputDTO, SearchResponseDTO } from '../types';
import { searchInputSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { ContentDTO, ContentTypeEnum } from '@/modules/catalog/types';
import { Content, Genre } from '@prisma/client';

export class SearchService {
  constructor(private repo: SearchRepository = defaultRepo) {}

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

  public async search(input: SearchInputDTO = {}): Promise<SearchResponseDTO> {
    const validated = validateInput(searchInputSchema, input);

    const page = validated.page ?? 1;
    const limit = validated.limit ?? 20;

    const { items, total } = await this.repo.advancedSearch(validated as SearchInputDTO);

    const totalPages = Math.ceil(total / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      results: items.map((item) => this.formatContent(item)),
      totalCount: total,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };
  }

  public async discover(input: SearchInputDTO = {}): Promise<SearchResponseDTO> {
    return this.search(input);
  }

  public async getTrending(limit = 10): Promise<ContentDTO[]> {
    const items = await this.repo.getTrending(limit);
    return items.map((item) => this.formatContent(item));
  }

  public async getRecentlyAdded(limit = 10): Promise<ContentDTO[]> {
    const items = await this.repo.getRecentlyAdded(limit);
    return items.map((item) => this.formatContent(item));
  }
}

export const searchService = new SearchService();
