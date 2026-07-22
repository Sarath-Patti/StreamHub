import { ContentDTO } from '@/modules/catalog/types';

export interface SimilarContentOptionsDTO {
  contentId: string;
  page?: number;
  limit?: number;
}

export interface RecommendationPaginationOptionsDTO {
  page?: number;
  limit?: number;
}

export interface TopRatedOptionsDTO {
  page?: number;
  limit?: number;
  minimumReviews?: number;
}

export interface RecommendationResponseDTO {
  items: ContentDTO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
