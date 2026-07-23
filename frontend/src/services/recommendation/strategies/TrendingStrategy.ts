import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class TrendingStrategy implements RecommendationStrategy {
  readonly name = 'Popularity';
  readonly maxScore = 15;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;

    let score = 10; // Baseline popularity
    if (subject.isTrending) {
      score = 15;
    }

    const firstGenre = subject.genres[0]?.name || 'the platform';
    const explanation = subject.isTrending
      ? `Currently trending among top picks in ${firstGenre}`
      : `Frequently discovered by viewers exploring ${firstGenre}`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: subject.isTrending
            ? 'Flagged as trending in global discovery.'
            : 'Standard discovery catalog engagement.',
        },
      ],
      explanations: [explanation],
    };
  }
}
