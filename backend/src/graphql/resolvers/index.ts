import { authResolvers } from '@/modules/auth/graphql/resolvers';

const baseResolvers = {
  Query: {
    status: () => 'StreamHub initialized.',
  },
};

export const resolvers = {
  Query: {
    ...baseResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
