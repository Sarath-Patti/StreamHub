import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class DiversityStrategy implements RecommendationStrategy {
  readonly id = 'diversity';
  readonly name = 'Content Diversity';
  readonly description = 'Scores content format, runtime balance, and language compatibility.';
  readonly maxScore = 10;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;

    let score = 8;
    if (subject.duration && subject.duration >= 90 && subject.duration <= 180) {
      score = 10;
    }

    const typeStr = subject.type === 'MOVIE' ? 'Feature Film' : 'TV Series';
    const durationStr = subject.duration ? `${subject.duration} min` : 'Episodic';

    const explanation = `Similar runtime and format (${durationStr}, ${typeStr})`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: `${typeStr} in ${subject.language} format (${durationStr}).`,
        },
      ],
      explanations: [explanation],
    };
  }
}
