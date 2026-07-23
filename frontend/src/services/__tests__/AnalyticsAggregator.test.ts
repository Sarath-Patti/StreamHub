import { describe, it, expect } from 'vitest';
import { AnalyticsAggregator } from '../analytics/AnalyticsAggregator';
import type { Collection } from '../collection/types';

const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Sci-Fi Vault',
    description: 'Best sci-fi movies',
    visibility: 'PUBLIC',
    contentCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-1',
        title: 'The Matrix',
        type: 'MOVIE',
        releaseYear: 1999,
        rating: 8.7,
        duration: 136,
        language: 'English',
        description: 'Neo learns the truth about reality.',
        genres: [{ id: 'sci-fi', name: 'Sci-Fi' }, { id: 'action', name: 'Action' }],
        isTrending: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
  },
];

describe('AnalyticsAggregator', () => {
  it('calculates genre distribution percentages accurately', () => {
    const genres = AnalyticsAggregator.calculateGenreDistribution(mockCollections);
    expect(genres.length).toBe(2);
    expect(genres[0].percentage + genres[1].percentage).toBe(100);
  });

  it('calculates collection stats and total saved count', () => {
    const stats = AnalyticsAggregator.calculateCollectionStats(mockCollections);
    expect(stats.totalCollections).toBe(1);
    expect(stats.totalSavedTitles).toBe(1);
    expect(stats.largestCollectionName).toBe('Sci-Fi Vault');
  });
});
