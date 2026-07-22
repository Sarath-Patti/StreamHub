import { z } from 'zod';

export const contentTypeSchema = z.enum(['MOVIE', 'SERIES']);

export const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: contentTypeSchema,
  releaseYear: z.number().int().min(1888, 'Invalid release year').max(new Date().getFullYear() + 5),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').optional().nullable(),
  language: z.string().min(1, 'Language is required'),
  rating: z.number().min(0).max(10).optional().nullable(),
  posterUrl: z.string().url('Invalid poster URL').optional().nullable(),
  bannerUrl: z.string().url('Invalid banner URL').optional().nullable(),
  isTrending: z.boolean().optional(),
  genreIds: z.array(z.string()).optional(),
});

export const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: contentTypeSchema.optional(),
  releaseYear: z.number().int().min(1888).max(new Date().getFullYear() + 5).optional(),
  duration: z.number().int().min(1).optional().nullable(),
  language: z.string().min(1).optional(),
  rating: z.number().min(0).max(10).optional().nullable(),
  posterUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  isTrending: z.boolean().optional(),
  genreIds: z.array(z.string()).optional(),
});

export const paginationQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
