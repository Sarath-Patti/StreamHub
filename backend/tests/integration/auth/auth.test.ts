import { describe, it, expect } from 'vitest';
import { authResolvers } from '@/modules/auth/graphql/resolvers';
import { UnauthorizedError } from '@/shared/errors';

describe('Auth Integration & Resolver Tests', () => {
  it('me query throws UnauthorizedError when context has no user', async () => {
    const context = { user: null } as any;
    await expect(authResolvers.Query.me({}, {}, context)).rejects.toThrow(UnauthorizedError);
  });
});
