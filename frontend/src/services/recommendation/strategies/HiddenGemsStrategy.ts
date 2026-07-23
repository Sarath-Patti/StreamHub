import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult } from './types';

export class HiddenGemsStrategy implements RecommendationStrategy {
  readonly id = 'hidden_gems';
  readonly name = 'Hidden Gems';
  readonly description = 'Discovers highly-rated, underrated titles that are off the mainstream radar.';
  readonly maxScore = 100;

  evaluate(target: Content, candidate?: Content): StrategyResult {
    const subject = candidate || target;
    const rating = subject.rating ?? 7.0;
    const isTrending = subject.isTrending;

    let score = 50;

    // High rating + non-trending = Hidden Gem bonus!
    if (rating >= 8.5) score += 35;
    else if (rating >= 7.8) score += 25;
    else if (rating >= 7.0) score += 15;

    if (!isTrending) {
      score += 15; // Non-mainstream bonus
    } else {
      score -= 10; // Mainstream penalty for hidden gems strategy
    }

    const finalScore = Math.min(100, Math.max(0, score));

    const explanations: string[] = [];
    if (!isTrending && rating >= 8.0) {
      explanations.push(`Underrated gem with high audience satisfaction (${rating.toFixed(1)}/10)`);
    } else if (rating >= 8.5) {
      explanations.push(`Exceptional quality rating (${rating.toFixed(1)}/10)`);
    } else {
      explanations.push(`Discovered outside mainstream trending charts`);
    }

    if (candidate) {
      const sharedGenres = candidate.genres
        .filter((g) => target.genres.some((tg) => tg.id.toLowerCase() === g.id.toLowerCase()))
        .map((g) => g.name);
      if (sharedGenres.length > 0) {
        explanations.push(`Shares ${sharedGenres.join(', ')} genre roots with ${target.title}`);
      }
    }

    return {
      score: finalScore,
      maxScore: this.maxScore,
      factors: [
        {
          name: 'Quality Rating',
          score: Math.round((rating / 10) * 60),
          maxScore: 60,
          description: `Base rating of ${rating.toFixed(1)}/10.`,
        },
        {
          name: 'Underrated Factor',
          score: !isTrending ? 40 : 20,
          maxScore: 40,
          description: !isTrending
            ? 'Non-mainstream discovery multiplier applied.'
            : 'Standard engagement index.',
        },
      ],
      explanations,
    };
  }
}
