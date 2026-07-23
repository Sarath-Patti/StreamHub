import { describe, it, expect } from 'vitest';
import { SearchRankingEngine } from '../search/SearchRankingEngine';
import type { Content } from '@/types';
import type { SearchFilterState } from '../search/types';

const mockContent: Content[] = [
  {
    id: '1',
    title: 'Inception',
    type: 'MOVIE',
    releaseYear: 2010,
    rating: 8.8,
    duration: 148,
    language: 'English',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    genres: [{ id: 'sci-fi', name: 'Sci-Fi' }, { id: 'action', name: 'Action' }],
    isTrending: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Dune',
    type: 'MOVIE',
    releaseYear: 2021,
    rating: 8.0,
    duration: 155,
    language: 'English',
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel.',
    genres: [{ id: 'sci-fi', name: 'Sci-Fi' }, { id: 'adventure', name: 'Adventure' }],
    isTrending: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

describe('SearchRankingEngine', () => {
  it('assigns higher score to exact title match', () => {
    const filters: SearchFilterState = {
      query: 'Inception',
      genreIds: [],
      minRating: 0,
    };

    const scored = SearchRankingEngine.scoreAndExplain(mockContent[0], filters);
    expect(scored.searchScore).toBeGreaterThanOrEqual(80);
    expect(scored.explanation.explanations).toContain('Exact title match');
  });

  it('ranks results deterministically by Search Score', () => {
    const filters: SearchFilterState = {
      query: '',
      genreIds: ['sci-fi'],
      minRating: 0,
    };

    const ranked = SearchRankingEngine.rankResults(mockContent, filters);
    expect(ranked[0].searchScore).toBeGreaterThanOrEqual(ranked[1].searchScore);
  });
});
