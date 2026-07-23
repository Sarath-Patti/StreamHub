import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class TrendingStrategy implements RecommendationStrategy {
  readonly id = 'trending';
  readonly name = 'Trending';
  readonly description = 'Highlights titles with high active viewer engagement and trending momentum.';
  readonly maxScore = 15;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;

    let score = 8;
    if (subject.isTrending) {
      score = 15;
    }

    const firstGenre = subject.genres[0]?.name || 'popular';
    const explanation = subject.isTrending
      ? `Trending among ${firstGenre} titles`
      : `Popular choice in the ${firstGenre} category`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: subject.isTrending
            ? 'Active trending status on StreamHub.'
            : 'Standard catalog engagement.',
        },
      ],
      explanations: [explanation],
    };
  }
}
