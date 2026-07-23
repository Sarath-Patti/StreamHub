import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';
import { GenreSimilarityStrategy } from './GenreSimilarityStrategy';

export class GenreStrategy implements RecommendationStrategy {
  readonly id = 'genre';
  readonly name = 'Genre Similarity';
  readonly description = 'Ranks titles strictly by shared genre categories and tag alignment.';
  readonly maxScore = 100;

  private innerStrategy = new GenreSimilarityStrategy();

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const rawResult = this.innerStrategy.evaluate(target, candidate);
    // Scale 40 max points up to 100
    const scaledScore = Math.round((rawResult.score / this.innerStrategy.maxScore) * this.maxScore);

    return {
      score: scaledScore,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score: scaledScore,
          maxScore: this.maxScore,
          description: rawResult.factors[0]?.description || 'Genre taxonomy alignment.',
        },
      ],
      explanations: rawResult.explanations,
    };
  }
}
