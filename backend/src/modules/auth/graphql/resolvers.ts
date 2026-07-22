import { GraphQLContext } from '@/graphql/context';
import { authService } from '../service/auth.service';
import { RegisterInputDTO, LoginInputDTO } from '../types';
import { UnauthorizedError } from '@/shared/errors';

export const authResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new UnauthorizedError('Authentication required');
      }
      return authService.getCurrentUser(context.user.id);
    },
  },
  Mutation: {
    register: async (_parent: unknown, { input }: { input: RegisterInputDTO }) => {
      return authService.register(input);
    },
    login: async (_parent: unknown, { input }: { input: LoginInputDTO }) => {
      return authService.login(input);
    },
    refreshToken: async (_parent: unknown, { refreshToken }: { refreshToken: string }) => {
      return authService.refreshToken(refreshToken);
    },
    logout: async () => {
      return true;
    },
  },
};
