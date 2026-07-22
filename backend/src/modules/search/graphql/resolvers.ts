import { searchService } from '../service/search.service';
import { SearchInputDTO } from '../types';

export const searchResolvers = {
  Query: {
    search: async (_parent: unknown, { input }: { input?: SearchInputDTO }) => {
      return searchService.search(input || {});
    },
    discover: async (_parent: unknown, { input }: { input?: SearchInputDTO }) => {
      return searchService.discover(input || {});
    },
    trending: async (_parent: unknown, { limit }: { limit?: number }) => {
      return searchService.getTrending(limit || 10);
    },
    recentlyAdded: async (_parent: unknown, { limit }: { limit?: number }) => {
      return searchService.getRecentlyAdded(limit || 10);
    },
  },
};
