import { ContentType as PrismaContentType } from '@prisma/client';

export type ContentTypeEnum = 'MOVIE' | 'SERIES';

export interface GenreDTO {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeDTO {
  id: string;
  episodeNumber: number;
  title: string;
  description?: string | null;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeasonDTO {
  id: string;
  seasonNumber: number;
  title?: string | null;
  description?: string | null;
  episodes: EpisodeDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentDTO {
  id: string;
  title: string;
  description: string;
  type: ContentTypeEnum;
  releaseYear: number;
  duration?: number | null;
  language: string;
  rating?: number | null;
  posterUrl?: string | null;
  bannerUrl?: string | null;
  isTrending: boolean;
  genres: GenreDTO[];
  seasons?: SeasonDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentConnectionDTO {
  items: ContentDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateContentInputDTO {
  title: string;
  description: string;
  type: ContentTypeEnum;
  releaseYear: number;
  duration?: number;
  language: string;
  rating?: number;
  posterUrl?: string;
  bannerUrl?: string;
  isTrending?: boolean;
  genreIds?: string[];
}

export interface UpdateContentInputDTO {
  title?: string;
  description?: string;
  type?: ContentTypeEnum;
  releaseYear?: number;
  duration?: number;
  language?: string;
  rating?: number;
  posterUrl?: string;
  bannerUrl?: string;
  isTrending?: boolean;
  genreIds?: string[];
}

export interface QueryContentOptions {
  page?: number;
  limit?: number;
  type?: PrismaContentType;
  genreId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
