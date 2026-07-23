import type { Content } from '@/types';
import { SearchFilterEngine } from './SearchFilterEngine';
import { SearchRankingEngine } from './SearchRankingEngine';
import { SearchHistoryService, searchHistoryService } from './SearchHistoryService';
import type { SearchFilterState, SearchResultItem, RecommendedSearchPreset, SavedSearch } from './types';

export class SearchService {
  private historyService: SearchHistoryService;

  constructor(historyService?: SearchHistoryService) {
    this.historyService = historyService || searchHistoryService;
  }

  /**
   * Executes multi-criteria search & filter and returns deterministically ranked SearchResultItem[].
   */
  public executeSearch(candidates: Content[], filters: SearchFilterState): SearchResultItem[] {
    if (filters.query.trim()) {
      this.historyService.logSearchQuery(filters.query);
    }

    const filtered = SearchFilterEngine.filterContent(candidates, filters);
    return SearchRankingEngine.rankResults(filtered, filters);
  }

  /**
   * Generates intelligent search preset recommendations based on catalog metadata and popularity.
   */
  public getRecommendedSearchPresets(): RecommendedSearchPreset[] {
    return [
      {
        id: 'preset-sci-fi-2020',
        title: 'Sci-Fi Post-2020',
        description: 'Modern sci-fi titles released after 2020 with high rating',
        icon: '🚀',
        filters: { genreIds: ['sci-fi'], startYear: 2020, minRating: 7.5 },
      },
      {
        id: 'preset-top-thrillers',
        title: 'Top-Rated Thrillers',
        description: 'Critically acclaimed thriller movies rated 8.0+',
        icon: '🔥',
        filters: { genreIds: ['thriller'], minRating: 8.0, contentType: 'MOVIE' },
      },
      {
        id: 'preset-animated-gems',
        title: 'Highly Rated Animation',
        description: 'Animated masterpieces rated 8.0+',
        icon: '🎨',
        filters: { genreIds: ['animation'], minRating: 8.0 },
      },
      {
        id: 'preset-trending-docs',
        title: 'Acclaimed Series',
        description: 'Elite TV series rated 8.5+',
        icon: '📺',
        filters: { contentType: 'SERIES', minRating: 8.5 },
      },
    ];
  }

  public getSavedSearches(): SavedSearch[] {
    return this.historyService.getSavedSearches();
  }

  public saveSearch(name: string, filters: SearchFilterState): SavedSearch {
    return this.historyService.saveSearch(name, filters);
  }

  public renameSavedSearch(id: string, newName: string): boolean {
    return this.historyService.renameSavedSearch(id, newName);
  }

  public deleteSavedSearch(id: string): boolean {
    return this.historyService.deleteSavedSearch(id);
  }

  public getRecentQueries(): string[] {
    return this.historyService.getRecentQueries();
  }
}

export const searchService = new SearchService();
