export const appConfig = {
  name: 'StreamHub',
  version: '2.0.0',
  description: 'Production-ready Content Intelligence Platform',
  graphqlUri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql',
  pagination: {
    defaultLimit: 12,
    maxLimit: 50,
  },
  search: {
    debounceMs: 300,
    maxHistoryQueries: 15,
    maxSavedSearches: 20,
  },
  analytics: {
    maxLoggedEvents: 50,
  },
  recommendations: {
    defaultStrategyId: 'hybrid',
    maxCandidates: 12,
  },
} as const;
