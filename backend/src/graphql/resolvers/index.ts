import { GraphQLContext } from '../context';

export const resolvers = {
  Query: {
    status: (_parent: unknown, _args: unknown, _context: GraphQLContext) => 'StreamHub initialized.',
  },
};
