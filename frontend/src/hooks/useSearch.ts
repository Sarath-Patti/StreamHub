import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Content } from '@/types';
import { searchService, searchHistoryService } from '@/services/search';
import type { SearchFilterState, SearchResultItem, SavedSearch } from '@/services/search';

export const INITIAL_SEARCH_FILTERS: SearchFilterState = {
  query: '',
  genreIds: [],
  contentType: undefined,
  minRating: 0,
  startYear: undefined,
  endYear: undefined,
  language: undefined,
};

export const useSearch = (allContentCandidates: Content[]) => {
  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_SEARCH_FILTERS);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    searchService.getSavedSearches()
  );
  const [recentQueries, setRecentQueries] = useState<string[]>(() =>
    searchService.getRecentQueries()
  );

  const refreshHistory = useCallback(() => {
    setSavedSearches(searchService.getSavedSearches());
    setRecentQueries(searchService.getRecentQueries());
  }, []);

  useEffect(() => {
    const unsubscribe = searchHistoryService.subscribe(refreshHistory);
    refreshHistory();
    return unsubscribe;
  }, [refreshHistory]);

  // Execute Search with memoization
  const results: SearchResultItem[] = useMemo(() => {
    return searchService.executeSearch(allContentCandidates, filters);
  }, [allContentCandidates, filters]);

  const updateFilters = useCallback((patch: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_SEARCH_FILTERS);
  }, []);

  const saveCurrentSearch = useCallback(
    (name: string) => {
      const saved = searchService.saveSearch(name, filters);
      refreshHistory();
      return saved;
    },
    [filters, refreshHistory]
  );

  const deleteSavedSearch = useCallback(
    (id: string) => {
      const ok = searchService.deleteSavedSearch(id);
      refreshHistory();
      return ok;
    },
    [refreshHistory]
  );

  const applySavedSearch = useCallback((saved: SavedSearch) => {
    setFilters({ ...saved.filters });
  }, []);

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    results,
    savedSearches,
    recentQueries,
    saveCurrentSearch,
    deleteSavedSearch,
    applySavedSearch,
    recommendedPresets: searchService.getRecommendedSearchPresets(),
  };
};
