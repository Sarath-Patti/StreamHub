import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class DiversityStrategy implements RecommendationStrategy {
  readonly name = 'Content Diversity';
  readonly maxScore = 10;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;

    let score = 8;
    if (subject.duration && subject.duration >= 90 && subject.duration <= 180) {
      score = 10;
    }

    const typeStr = subject.type === 'MOVIE' ? 'Feature Film' : 'TV Series';
    const langStr = subject.language;
    const durationStr = subject.duration ? `${subject.duration} minutes` : 'Episodic format';

    const explanation = `Matches your preference for ${langStr} ${typeStr.toLowerCase()}s (${durationStr})`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: `${typeStr} in ${langStr} format.`,
        },
      ],
      explanations: [explanation],
    };
  }
}
