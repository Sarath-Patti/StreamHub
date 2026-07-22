import { z } from 'zod';

export const bulkOperationSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one ID must be provided'),
});

export const adminPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  includeDeleted: z.boolean().optional().default(false),
});

export const moderationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
