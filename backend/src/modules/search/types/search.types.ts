import { ContentDTO, ContentTypeEnum } from '@/modules/catalog/types';

export interface SearchInputDTO {
  query?: string;
  genre?: string;
  type?: ContentTypeEnum;
  language?: string;
  releaseYear?: number;
  minimumRating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'releaseYear' | 'rating' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponseDTO {
  results: ContentDTO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
