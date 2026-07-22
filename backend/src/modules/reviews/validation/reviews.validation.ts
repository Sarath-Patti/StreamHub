import { z } from 'zod';

export const createReviewSchema = z.object({
  contentId: z.string().min(1, 'contentId is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  review: z.string().max(2000, 'Review length cannot exceed 2000 characters').optional().nullable(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  review: z.string().max(2000, 'Review length cannot exceed 2000 characters').optional().nullable(),
});

export const deleteReviewSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
});

export const reviewsPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['newest', 'highest']).optional().default('newest'),
});
