import { z } from 'zod';

export const similarContentSchema = z.object({
  contentId: z.string().min(1, 'contentId is required'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const recommendationPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const topRatedSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  minimumReviews: z.number().int().min(0).default(0),
});
