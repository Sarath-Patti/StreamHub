// Shared application-level types

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type ContentType = 'MOVIE' | 'SERIES';

export interface Genre {
  id: string;
  name: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  releaseYear: number;
  duration?: number;
  language: string;
  rating?: number;
  posterUrl?: string;
  bannerUrl?: string;
  isTrending: boolean;
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<AuthUser, 'id' | 'name'>;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
  content: Content;
}

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ContentConnection extends PaginationInfo {
  results: Content[];
}
