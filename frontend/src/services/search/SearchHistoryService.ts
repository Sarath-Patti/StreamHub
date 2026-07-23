import type { SavedSearch, SearchFilterState, SearchHistoryState } from './types';

const SAVED_SEARCHES_KEY = 'streamhub_saved_searches';
const RECENT_QUERIES_KEY = 'streamhub_recent_search_queries';

type Listener = () => void;

export class SearchHistoryService {
  private savedSearches: SavedSearch[] = [];
  private recentQueries: string[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadStorage();
  }

  private loadStorage(): void {
    try {
      const savedData = localStorage.getItem(SAVED_SEARCHES_KEY);
      if (savedData) {
        this.savedSearches = JSON.parse(savedData);
      } else {
        // Initial sample saved searches
        this.savedSearches = [
          {
            id: 'saved-1',
            name: 'Top Sci-Fi Movies (8+ Rating)',
            filters: {
              query: '',
              genreIds: ['sci-fi'],
              contentType: 'MOVIE',
              minRating: 8.0,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'saved-2',
            name: 'Recent Highly-Rated Series',
            filters: {
              query: '',
              genreIds: [],
              contentType: 'SERIES',
              minRating: 8.5,
              startYear: 2020,
            },
            createdAt: new Date().toISOString(),
          },
        ];
        this.saveSavedSearches();
      }

      const recentData = localStorage.getItem(RECENT_QUERIES_KEY);
      if (recentData) {
        this.recentQueries = JSON.parse(recentData);
      } else {
        this.recentQueries = ['Inception', 'Dune', 'Avatar', 'Dark Knight', 'Matrix'];
        this.saveRecentQueries();
      }
    } catch {
      this.savedSearches = [];
      this.recentQueries = [];
    }
  }

  private saveSavedSearches(): void {
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(this.savedSearches));
    } catch (e) {
      console.error('[SearchHistoryService] Failed to save saved searches:', e);
    }
    this.notify();
  }

  private saveRecentQueries(): void {
    try {
      localStorage.setItem(RECENT_QUERIES_KEY, JSON.stringify(this.recentQueries.slice(0, 15)));
    } catch (e) {
      console.error('[SearchHistoryService] Failed to save recent queries:', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Logs a search query string to recent history.
   */
  public logSearchQuery(query: string): void {
    const q = query.trim();
    if (!q) return;

    this.recentQueries = [q, ...this.recentQueries.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 15);
    this.saveRecentQueries();
  }

  /**
   * Returns recent query string history.
   */
  public getRecentQueries(): string[] {
    return [...this.recentQueries];
  }

  /**
   * Clears recent query history.
   */
  public clearRecentQueries(): void {
    this.recentQueries = [];
    this.saveRecentQueries();
  }

  /**
   * Saves a search filter combination with a custom name.
   */
  public saveSearch(name: string, filters: SearchFilterState): SavedSearch {
    const newSaved: SavedSearch = {
      id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || 'Saved Filter Preset',
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    this.savedSearches.unshift(newSaved);
    this.saveSavedSearches();
    return newSaved;
  }

  /**
   * Renames a saved search preset.
   */
  public renameSavedSearch(id: string, newName: string): boolean {
    const item = this.savedSearches.find((s) => s.id === id);
    if (item && newName.trim()) {
      item.name = newName.trim();
      this.saveSavedSearches();
      return true;
    }
    return false;
  }

  /**
   * Deletes a saved search preset.
   */
  public deleteSavedSearch(id: string): boolean {
    const initialLen = this.savedSearches.length;
    this.savedSearches = this.savedSearches.filter((s) => s.id !== id);
    if (this.savedSearches.length !== initialLen) {
      this.saveSavedSearches();
      return true;
    }
    return false;
  }

  /**
   * Returns all saved searches.
   */
  public getSavedSearches(): SavedSearch[] {
    return [...this.savedSearches];
  }

  /**
   * Returns history telemetry state.
   */
  public getHistoryState(): SearchHistoryState {
    return {
      recentQueries: this.getRecentQueries(),
      topGenres: ['Sci-Fi', 'Drama', 'Action', 'Thriller'],
      frequentFilters: [
        { label: 'Rating 8.0+', count: 14 },
        { label: 'Movies Only', count: 18 },
        { label: 'Post-2015', count: 12 },
      ],
    };
  }
}

export const searchHistoryService = new SearchHistoryService();
