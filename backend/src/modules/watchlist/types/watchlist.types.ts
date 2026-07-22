import { ContentDTO } from '@/modules/catalog/types';

export interface WatchlistItemDTO {
  id: string;
  userId: string;
  contentId: string;
  content: ContentDTO;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistConnectionDTO {
  items: WatchlistItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AddToWatchlistInputDTO {
  contentId: string;
}

export interface RemoveFromWatchlistInputDTO {
  contentId: string;
}

export interface QueryWatchlistOptions {
  page?: number;
  limit?: number;
}
