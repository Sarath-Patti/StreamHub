import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class RatingStrategy implements RecommendationStrategy {
  readonly name = 'Rating Weight';
  readonly maxScore = 25;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;
    const rating = subject.rating ?? 7.0;

    // Scale rating (0-10) to maxScore (0-25)
    const score = Math.round((rating / 10) * this.maxScore);

    const explanation =
      rating >= 8.5
        ? `Critically acclaimed by the community with an impressive ${rating.toFixed(1)}/10 rating`
        : rating >= 7.5
        ? `Highly rated by StreamHub viewers (${rating.toFixed(1)}/10 rating)`
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
