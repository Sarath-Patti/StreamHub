import { ContentDTO } from '@/modules/catalog/types';

export interface AdminDashboardStatsDTO {
  totalUsers: number;
  totalContent: number;
  movies: number;
  series: number;
  reviews: number;
  watchlists: number;
  trendingItems: number;
  topRatedItems: number;
  newestContent: ContentDTO[];
}

export interface BulkOperationInputDTO {
  ids: string[];
}

export interface AdminPaginationOptionsDTO {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}
