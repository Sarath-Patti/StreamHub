import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class RatingStrategy implements RecommendationStrategy {
  readonly id = 'rating';
  readonly name = 'Rating Weight';
  readonly description = 'Ranks titles based on community and critical review scores.';
  readonly maxScore = 25;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;
    const rating = subject.rating ?? 7.0;

    const score = Math.round((rating / 10) * this.maxScore);

    const explanation =
      rating >= 9.0
        ? `Community rating above 9 (${rating.toFixed(1)}/10)`
        : rating >= 8.5
        ? `Critically acclaimed with an impressive ${rating.toFixed(1)}/10 rating`
        : `Solid audience satisfaction rating (${rating.toFixed(1)}/10)`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: `Community rating of ${rating.toFixed(1)}/10.`,
        },
      ],
      explanations: [explanation],
    };
  }
}
