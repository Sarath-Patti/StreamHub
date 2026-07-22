import { describe, it, expect } from 'vitest';
import { resolvers } from '@/graphql/resolvers/index';
import { APP_NAME, APP_VERSION } from '@/shared/constants';

describe('Health & Status Smoke Tests', () => {
  it('GraphQL status query returns "StreamHub initialized."', () => {
    const result = resolvers.Query.status({}, {}, {} as any);
    expect(result).toBe('StreamHub initialized.');
  });

  it('App constants are properly defined', () => {
    expect(APP_NAME).toBe('StreamHub API');
    expect(APP_VERSION).toBe('0.2.0');
  });
});
