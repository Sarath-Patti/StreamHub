import { z } from 'zod';

export const searchInputSchema = z.object({
  query: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  type: z.enum(['MOVIE', 'SERIES']).optional().nullable(),
  language: z.string().optional().nullable(),
  releaseYear: z.number().int().min(1800).max(2100).optional().nullable(),
  minimumRating: z.number().min(0).max(10).optional().nullable(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['releaseYear', 'rating', 'title', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
