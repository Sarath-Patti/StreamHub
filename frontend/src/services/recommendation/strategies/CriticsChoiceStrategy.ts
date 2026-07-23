import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class CriticsChoiceStrategy implements RecommendationStrategy {
  readonly id = 'critics_choice';
  readonly name = 'Critics\' Choice';
  readonly description = 'Filters and ranks strictly by highest critical acclaim and elite community ratings.';
  readonly maxScore = 100;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;
    const rating = subject.rating ?? 7.0;

    // Strict non-linear scoring scaling heavy for 8.5+
    let score = 40;
    if (rating >= 9.2) score = 100;
    else if (rating >= 8.8) score = 92;
    else if (rating >= 8.4) score = 82;
    else if (rating >= 8.0) score = 70;
    else if (rating >= 7.5) score = 55;
    else score = Math.round((rating / 10) * 50);

    const explanations: string[] = [];
    if (rating >= 9.0) {
      explanations.push(`Masterpiece status with a legendary ${rating.toFixed(1)}/10 rating`);
    } else if (rating >= 8.5) {
      explanations.push(`Critically acclaimed winner with ${rating.toFixed(1)}/10 score`);
    } else {
      explanations.push(`Verified audience score of ${rating.toFixed(1)}/10`);
    }

    if (candidate) {
      const yearDiff = Math.abs(target.releaseYear - candidate.releaseYear);
      if (yearDiff <= 5) {
        explanations.push(`Released in proximity to ${target.title} (${candidate.releaseYear})`);
      }
    }

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: 'Critical Acclaim',
          score,
          maxScore: this.maxScore,
          description: `Weighted rating score of ${rating.toFixed(1)}/10.`,
        },
      ],
      explanations,
    };
  }
}
