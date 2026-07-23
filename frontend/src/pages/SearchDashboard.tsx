import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import type { Content, Genre } from '@/types';
import { DISCOVER_CONTENT, GET_GENRES } from '@/graphql/discover';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/discover/SearchBar';
import { ErrorState } from '@/components/discover/ErrorState';
import { Spinner } from '@/components/ui';
import {
  SearchFiltersPanel,
  ActiveFiltersBar,
  SearchResultCard,
  SavedSearchesPanel,
  SearchHistoryPanel,
  RecommendedSearchesBar,
} from '@/components/search';

export const SearchDashboard: React.FC = () => {
  // Fetch all available catalog content for local deterministic ranking
  const { data: discoverData, loading, error, refetch } = useQuery<{
    discover: { results: Content[] };
  }>(DISCOVER_CONTENT, {
    variables: { limit: 100 },
  });

  const { data: genreData } = useQuery<{ genres: Genre[] }>(GET_GENRES);

  const candidates = discoverData?.discover?.results || [];
  const genres = genreData?.genres || [];

  const {
    filters,
    updateFilters,
    resetFilters,
    results,
    savedSearches,
    recentQueries,
    saveCurrentSearch,
    deleteSavedSearch,
    applySavedSearch,
    recommendedPresets,
  } = useSearch(candidates);

  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Search <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Deterministic multi-criteria search, explainable ranking engine, and personal discovery.
          </p>
        </div>
      </div>

      {/* Recommended Discovery Searches Bar */}
      <RecommendedSearchesBar
        presets={recommendedPresets}
        onSelectPreset={(preset) => updateFilters(preset.filters)}
      />

      {/* Main Search Bar & Toggle Filter Button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <SearchBar
              value={filters.query}
              onChange={(q) => updateFilters({ query: q })}
              placeholder="Search by title, keyword, genre, or language..."
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={[
              'shrink-0 rounded-2xl px-5 py-3.5 text-xs font-bold transition-all border flex items-center gap-2 select-none shadow-md',
              showFilters
                ? 'bg-brand-500 text-white border-brand-400'
                : 'bg-surface-800 text-text-secondary border-surface-700 hover:text-white',
            ].join(' ')}
          >
            <span>⚙️</span> {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>

        {/* Recent Search Queries */}
        <SearchHistoryPanel
          recentQueries={recentQueries}
          onSelectQuery={(q) => updateFilters({ query: q })}
        />
      </div>

      {/* Active Filters Bar */}
      <ActiveFiltersBar
        filters={filters}
        availableGenres={genres}
        onReset={resetFilters}
        onRemoveGenre={(gid) =>
          updateFilters({ genreIds: filters.genreIds.filter((id) => id !== gid) })
        }
        onClearFilter={(key) => updateFilters({ [key]: key === 'genreIds' ? [] : key === 'minRating' ? 0 : undefined })}
        onSaveSearch={saveCurrentSearch}
      />

      {/* Advanced Filters Panel */}
      {showFilters && (
        <SearchFiltersPanel
          filters={filters}
          availableGenres={genres}
          onChange={updateFilters}
        />
      )}

      {/* Saved Searches Section */}
      <SavedSearchesPanel
        savedSearches={savedSearches}
        onApply={applySavedSearch}
        onDelete={deleteSavedSearch}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-3 text-xs text-text-muted">
        <span>
          Found <span className="font-bold text-white">{results.length}</span> matching titles ranked deterministically
        </span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-700/60 bg-surface-800/40 p-12 text-center shadow-inner">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white mb-1">No matching titles found</h3>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            Try adjusting your search query, lowering minimum rating, or clearing active genre filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold px-4 py-2 text-xs shadow-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {results.map((item) => (
            <SearchResultCard key={item.content.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDashboard;
