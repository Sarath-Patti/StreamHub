import type { Content } from '@/types';

export interface SearchFilterState {
  query: string;
  genreIds: string[];
  contentType?: 'MOVIE' | 'SERIES';
  minRating: number;
  startYear?: number;
  endYear?: number;
  language?: string;
  minDuration?: number;
  maxDuration?: number;
}

export interface SearchExplanation {
  score: number;
  factors: Array<{ name: string; score: number; maxScore: number; description: string }>;
  explanations: string[];
}

export interface SearchResultItem {
  content: Content;
  searchScore: number;
  explanation: SearchExplanation;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilterState;
  createdAt: string;
}

export interface SearchHistoryState {
  recentQueries: string[];
  topGenres: string[];
  frequentFilters: Array<{ label: string; count: number }>;
}

export interface RecommendedSearchPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  filters: Partial<SearchFilterState>;
}
