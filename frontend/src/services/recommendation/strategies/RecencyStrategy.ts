import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class RecencyStrategy implements RecommendationStrategy {
  readonly id = 'recency';
  readonly name = 'Release Recency';
  readonly description = 'Scores titles based on release year proximity and modern era freshness.';
  readonly maxScore = 10;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const currentYear = new Date().getFullYear();

    if (!candidate) {
      const diff = currentYear - target.releaseYear;
      let score = 10;
      if (diff > 20) score = 6;
      else if (diff > 10) score = 8;

      const explanation =
        diff <= 3
          ? `Released recently (${target.releaseYear})`
          : `Established release from ${target.releaseYear}`;

      return {
        score,
        maxScore: this.maxScore,
        factors: [
          {
            name: this.name,
            score,
            maxScore: this.maxScore,
            description: `Released in ${target.releaseYear} (${diff} years ago).`,
          },
        ],
        explanations: [explanation],
      };
    }

    const yearDiff = Math.abs(target.releaseYear - candidate.releaseYear);
    let score = 10;

    if (yearDiff === 0) score = 10;
    else if (yearDiff <= 3) score = 9;
    else if (yearDiff <= 8) score = 7;
    else if (yearDiff <= 15) score = 5;
    else score = 3;

    const explanation =
      yearDiff <= 3
        ? `Released recently (${candidate.releaseYear})`
        : `Classic release from ${candidate.releaseYear}`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: `Year gap of ${yearDiff} years (${candidate.releaseYear} vs ${target.releaseYear}).`,
        },
      ],
      explanations: [explanation],
    };
  }
}
