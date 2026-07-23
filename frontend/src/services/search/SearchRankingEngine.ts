import type { Content } from '@/types';
import type { SearchFilterState, SearchExplanation, SearchResultItem } from './types';
import { collectionService } from '@/services/collection';

export class SearchRankingEngine {
  /**
   * Evaluates and assigns a deterministic Search Score (0–100) and explanation to a content item.
   */
  public static scoreAndExplain(item: Content, filters: SearchFilterState): SearchResultItem {
    const q = filters.query.trim().toLowerCase();
    const title = item.title.toLowerCase();

    let titleScore = 0;
    const titleExplanations: string[] = [];

    // Title Match Factors (Max 35 pts)
    if (q) {
      if (title === q) {
        titleScore = 35;
        titleExplanations.push('Exact title match');
      } else if (title.startsWith(q)) {
        titleScore = 30;
        titleExplanations.push(`Title starts with "${filters.query.trim()}"`);
      } else if (title.includes(q)) {
        titleScore = 24;
        titleExplanations.push(`Contains title search query "${filters.query.trim()}"`);
      } else {
        titleScore = 15;
        titleExplanations.push('Matches search keyword in description or metadata');
      }
    } else {
      titleScore = 20;
      titleExplanations.push('Catalog match');
    }

    // Genre Relevance Factor (Max 20 pts)
    let genreScore = 10;
    if (filters.genreIds.length > 0) {
      const itemGenreIds = new Set(item.genres.map((g) => g.id.toLowerCase()));
      const matched = filters.genreIds.filter((gid) => itemGenreIds.has(gid.toLowerCase()));
      genreScore = Math.min(20, matched.length * 10);
      if (matched.length > 0) {
        titleExplanations.push(`Matches ${matched.length} selected genre filter${matched.length > 1 ? 's' : ''}`);
      }
    } else if (item.genres.length > 0) {
      genreScore = 14;
      titleExplanations.push(`Features core genres (${item.genres.map((g) => g.name).join(', ')})`);
    }

    // Rating Factor (Max 20 pts)
    const rating = item.rating ?? 7.0;
    const ratingScore = Math.round((rating / 10) * 20);
    if (rating >= 8.5) {
      titleExplanations.push(`Critically acclaimed rating of ${rating.toFixed(1)}/10`);
    } else if (rating >= 7.8) {
      titleExplanations.push(`Solid audience rating of ${rating.toFixed(1)}/10`);
    }

    // Popularity & Trending Factor (Max 15 pts)
    const trendingScore = item.isTrending ? 15 : 8;
    if (item.isTrending) {
      titleExplanations.push('Popular and trending this month');
    }

    // Collection Affinity Factor (Max 10 pts)
    const collections = collectionService.getCollections();
    const inUserCollection = collections.some((col) =>
      col.items.some((saved) => saved.id === item.id)
    );
    const collectionScore = inUserCollection ? 10 : 4;
    if (inUserCollection) {
      titleExplanations.push('Similar to your saved collection workspaces');
    }

    const totalRaw = titleScore + genreScore + ratingScore + trendingScore + collectionScore;
    const finalScore = Math.min(100, Math.max(10, totalRaw));

    const explanation: SearchExplanation = {
      score: finalScore,
      factors: [
        { name: 'Title & Term Match', score: titleScore, maxScore: 35, description: 'Relevance of search query string match.' },
        { name: 'Genre Alignment', score: genreScore, maxScore: 20, description: 'Match ratio with selected or core genres.' },
        { name: 'Audience Rating', score: ratingScore, maxScore: 20, description: `Score derived from ${rating.toFixed(1)}/10 rating.` },
        { name: 'Trending Momentum', score: trendingScore, maxScore: 15, description: item.isTrending ? 'Active trending status.' : 'Standard popularity.' },
        { name: 'Collection Affinity', score: collectionScore, maxScore: 10, description: inUserCollection ? 'Saved in personal workspace.' : 'Catalog title.' },
      ],
      explanations: titleExplanations,
    };

    return {
      content: item,
      searchScore: finalScore,
      explanation,
    };
  }

  /**
   * Ranks filtered content items by Search Score deterministically.
   */
  public static rankResults(filteredCandidates: Content[], filters: SearchFilterState): SearchResultItem[] {
    const scored = filteredCandidates.map((item) => this.scoreAndExplain(item, filters));
    return scored.sort((a, b) => b.searchScore - a.searchScore);
  }
}
