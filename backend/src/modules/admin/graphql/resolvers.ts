import { GraphQLContext } from '@/graphql/context';
import { adminService } from '../service/admin.service';
import { CreateContentInputDTO, UpdateContentInputDTO } from '@/modules/catalog/types';

export const adminResolvers = {
  Query: {
    adminDashboard: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      return adminService.getDashboardStats(context.user);
    },
    reportedReviews: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: GraphQLContext
    ) => {
      return adminService.getReportedReviews(context.user, { page, limit });
    },
    deletedContent: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: GraphQLContext
    ) => {
      return adminService.getDeletedContent(context.user, { page, limit });
    },
    adminContent: async (
      _parent: unknown,
      { page, limit, includeDeleted }: { page?: number; limit?: number; includeDeleted?: boolean },
      context: GraphQLContext
    ) => {
      return adminService.getAdminContent(context.user, { page, limit, includeDeleted });
    },
  },
  Mutation: {
    createContent: async (
      _parent: unknown,
      { input }: { input: CreateContentInputDTO },
      context: GraphQLContext
    ) => {
      if (context.user?.role === 'ADMIN') {
        return adminService.createContent(context.user, input);
      }
      return catalogMutationsFallback(context);
    },
    updateContent: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateContentInputDTO },
      context: GraphQLContext
    ) => {
      if (context.user?.role === 'ADMIN') {
        return adminService.updateContent(context.user, id, input);
      }
      return catalogMutationsFallback(context);
    },
    deleteContent: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (context.user?.role === 'ADMIN') {
        return adminService.softDeleteContent(context.user, id);
      }
      return catalogMutationsFallback(context);
    },
    restoreContent: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return adminService.restoreContent(context.user, id);
    },
    bulkDeleteContent: async (_parent: unknown, { ids }: { ids: string[] }, context: GraphQLContext) => {
      return adminService.bulkDeleteContent(context.user, { ids });
    },
    bulkRestoreContent: async (_parent: unknown, { ids }: { ids: string[] }, context: GraphQLContext) => {
      return adminService.bulkRestoreContent(context.user, { ids });
    },
    hideReview: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return adminService.hideReview(context.user, id);
    },
    restoreReview: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return adminService.restoreReview(context.user, id);
    },
    deleteReviewAdmin: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return adminService.deleteReviewAdmin(context.user, id);
    },
  },
};

function catalogMutationsFallback(context: GraphQLContext): never {
  adminService.requireAdmin(context.user);
  throw new Error('Unreachable');
}
