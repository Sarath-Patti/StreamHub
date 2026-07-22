import { ContentDTO } from '@/modules/catalog/types';

export interface ReviewUserDTO {
  id: string;
  name: string;
}

export interface ReviewDTO {
  id: string;
  userId: string;
  contentId: string;
  user: ReviewUserDTO;
  rating: number;
  review?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserReviewDTO {
  id: string;
  userId: string;
  contentId: string;
  content: ContentDTO;
  rating: number;
  review?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewConnectionDTO {
  items: ReviewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserReviewConnectionDTO {
  items: UserReviewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatingDistributionDTO {
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
}

export interface CreateReviewInputDTO {
  contentId: string;
  rating: number;
  review?: string;
}

export interface UpdateReviewInputDTO {
  rating?: number;
  review?: string;
}

export interface QueryReviewsOptions {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'highest';
}
