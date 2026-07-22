import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  contentId: z.string().min(1, 'contentId is required'),
});

export const removeFromWatchlistSchema = z.object({
  contentId: z.string().min(1, 'contentId is required'),
});

export const watchlistPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
