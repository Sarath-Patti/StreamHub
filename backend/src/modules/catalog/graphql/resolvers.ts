import { catalogService } from '../service/catalog.service';
import { CreateContentInputDTO, UpdateContentInputDTO, QueryContentOptions } from '../types';

export const catalogResolvers = {
  Query: {
    content: async (_parent: unknown, { id }: { id: string }) => {
      return catalogService.getContentById(id);
    },
    contents: async (_parent: unknown, args: QueryContentOptions) => {
      return catalogService.getContents(args);
    },
    searchContent: async (
      _parent: unknown,
      { query, page, limit }: { query: string; page?: number; limit?: number }
    ) => {
      return catalogService.searchContent(query, page, limit);
    },
    trendingContent: async (_parent: unknown, { limit }: { limit?: number }) => {
      return catalogService.getTrendingContent(limit);
    },
    genres: async () => {
      return catalogService.getAllGenres();
    },
  },
  Mutation: {
    createContent: async (_parent: unknown, { input }: { input: CreateContentInputDTO }) => {
      return catalogService.createContent(input);
    },
    updateContent: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateContentInputDTO }
    ) => {
      return catalogService.updateContent(id, input);
    },
    deleteContent: async (_parent: unknown, { id }: { id: string }) => {
      return catalogService.deleteContent(id);
    },
  },
};
