import { describe, it, expect } from 'vitest';
import { recommendationService } from '../recommendation/recommendation.service';
import { recommendationRegistry } from '../recommendation/RecommendationRegistry';
import type { Content } from '@/types';

const targetItem: Content = {
  id: 'c1',
  title: 'Interstellar',
  type: 'MOVIE',
  releaseYear: 2014,
  rating: 8.7,
  duration: 169,
  language: 'English',
  description: 'Space exploration masterpiece.',
  genres: [{ id: 'sci-fi', name: 'Sci-Fi' }, { id: 'drama', name: 'Drama' }],
  isTrending: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const candidateItem: Content = {
  id: 'c2',
  title: 'The Martian',
  type: 'MOVIE',
  releaseYear: 2015,
  rating: 8.0,
  duration: 144,
  language: 'English',
  description: 'Astronaut stranded on Mars.',
  genres: [{ id: 'sci-fi', name: 'Sci-Fi' }, { id: 'adventure', name: 'Adventure' }],
  isTrending: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('RecommendationService', () => {
  it('registers standard strategies in RecommendationRegistry', () => {
    const strategies = recommendationRegistry.getAll();
    expect(strategies.length).toBeGreaterThanOrEqual(5);
    expect(recommendationRegistry.has('hybrid')).toBe(true);
    expect(recommendationRegistry.has('hidden_gems')).toBe(true);
  });

  it('computes match score out of 100 using active strategy', () => {
    const res = recommendationService.computeRecommendationScore(targetItem, candidateItem, 'hybrid');
    expect(res.score).toBeGreaterThan(0);
    expect(res.score).toBeLessThanOrEqual(100);
    expect(res.explanations.length).toBeGreaterThan(0);
  });
});
