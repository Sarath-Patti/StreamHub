import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class GenreSimilarityStrategy implements RecommendationStrategy {
  readonly name = 'Genre Similarity';
  readonly maxScore = 40;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    if (!candidate) {
      // Standalone evaluation of target's rich genre profile
      const genreCount = target.genres.length;
      const score = Math.min(this.maxScore, Math.max(20, genreCount * 12));
      const genreList = target.genres.map((g) => g.name).join(', ');

      return {
        score,
        maxScore: this.maxScore,
        factors: [
          {
            name: this.name,
            score,
            maxScore: this.maxScore,
            description: `Features a rich mix of ${genreCount} core genres (${genreList}).`,
          },
        ],
        explanations: [
          `Shares core genres (${genreList}) with titles you frequently explore`,
        ],
      };
    }

    // Pairwise comparison between target and candidate
    const targetGenres = new Set(target.genres.map((g) => g.id.toLowerCase()));
    const candidateGenres = candidate.genres.map((g) => g.id.toLowerCase());

    const shared = candidateGenres.filter((id) => targetGenres.has(id));
    const overlapRatio = targetGenres.size > 0 ? shared.length / targetGenres.size : 0;
    const score = Math.round(overlapRatio * this.maxScore);

    const sharedNames = candidate.genres
      .filter((g) => targetGenres.has(g.id.toLowerCase()))
      .map((g) => g.name);

    const explanation =
      sharedNames.length > 0
        ? `Shares ${sharedNames.join(', ')} genre tags with ${target.title}`
        : `Complements ${target.title} with alternative genre categories`;

    return {
      score,
      maxScore: this.maxScore,
      factors: [
        {
          name: this.name,
          score,
          maxScore: this.maxScore,
          description: `Shared ${shared.length} of ${target.genres.length} genres with target content.`,
        },
      ],
      explanations: [explanation],
    };
  }
}
