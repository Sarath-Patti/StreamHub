import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import type { Content, Genre, ContentType, ContentConnection } from '@/types';
import {
  GET_GENRES,
  GET_TRENDING,
  GET_POPULAR,
  GET_RECENTLY_ADDED,
  DISCOVER_CONTENT,
} from '@/graphql/discover';
import {
  MovieCard,
  MovieSkeletonGrid,
  DiscoverSection,
  SearchBar,
  GenreFilter,
  Pagination,
  EmptyState,
  ErrorState,
} from '@/components/discover';
import type { SortByOption } from '@/components/discover/GenreFilter';
import { Badge, Button } from '@/components/ui';

export const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL query parameters (supports deep linking)
  const searchQuery = searchParams.get('q') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const selectedType = (searchParams.get('type') as ContentType | 'ALL') || 'ALL';
  const sortBy = (searchParams.get('sortBy') as SortByOption) || 'createdAt';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const isFilteringOrSearching = useMemo(() => {
    return Boolean(searchQuery.trim() || selectedGenre || selectedType !== 'ALL' || page > 1);
  }, [searchQuery, selectedGenre, selectedType, page]);

  // Helper to update searchParams
  const updateParams = (newParams: Record<string, string | number | undefined | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === 'ALL' || (key === 'page' && value === 1)) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  // Queries
  const { data: genresData } = useQuery<{ genres: Genre[] }>(GET_GENRES);

  const { data: trendingData, loading: trendingLoading } = useQuery<{ trending: Content[] }>(
    GET_TRENDING,
    { variables: { limit: 6 }, skip: isFilteringOrSearching }
  );

  const { data: popularData, loading: popularLoading } = useQuery<{ discover: ContentConnection }>(
    GET_POPULAR,
    {
      variables: { input: { sortBy: 'rating', sortOrder: 'desc', limit: 6 } },
      skip: isFilteringOrSearching,
    }
  );

  const { data: recentData, loading: recentLoading } = useQuery<{ recentlyAdded: Content[] }>(
    GET_RECENTLY_ADDED,
    { variables: { limit: 6 }, skip: isFilteringOrSearching }
  );

  const discoverInput = useMemo(() => ({
    query: searchQuery.trim() || undefined,
    genre: selectedGenre || undefined,
    type: selectedType !== 'ALL' ? selectedType : undefined,
    sortBy,
    sortOrder: sortBy === 'title' ? 'asc' : 'desc',
    page,
    limit: 12,
  }), [searchQuery, selectedGenre, selectedType, sortBy, page]);

  const {
    data: discoverData,
    loading: discoverLoading,
    error: discoverError,
    refetch: refetchDiscover,
  } = useQuery<{ discover: ContentConnection }>(DISCOVER_CONTENT, {
    variables: { input: discoverInput },
  });

  const genres = genresData?.genres || [];
  const searchResults = discoverData?.discover.results || [];
  const totalCount = discoverData?.discover.totalCount || 0;
  const totalPages = discoverData?.discover.totalPages || 1;
  const currentPage = discoverData?.discover.currentPage || 1;

  const topTrending = trendingData?.trending?.[0];

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Top Header & Search */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Discover <span className="gradient-text">StreamHub</span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Explore trending movies, series, top-rated content, and personalized genres.
            </p>
          </div>
        </div>

        {/* Search input bar */}
        <SearchBar
          value={searchQuery}
          onChange={(q) => updateParams({ q, page: 1 })}
          placeholder="Search movies, TV series, actors, or topics..."
        />

        {/* Genre & Filters bar */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={(genre) => updateParams({ genre, page: 1 })}
          selectedType={selectedType}
          onTypeSelect={(type) => updateParams({ type, page: 1 })}
          sortBy={sortBy}
          onSortChange={(sortByVal) => updateParams({ sortBy: sortByVal, page: 1 })}
        />
      </div>

      {/* Main Content Area */}
      {isFilteringOrSearching ? (
        /* Filtered / Search Results View */
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-700/60 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Search Results</h2>
              <Badge variant="brand" className="text-xs">
                {totalCount} {totalCount === 1 ? 'title' : 'titles'}
              </Badge>
            </div>

            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          </div>

          {discoverError ? (
            <ErrorState message={discoverError.message} onRetry={() => refetchDiscover()} />
          ) : discoverLoading ? (
            <MovieSkeletonGrid count={12} />
          ) : searchResults.length === 0 ? (
            <EmptyState onResetFilters={handleResetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {searchResults.map((item) => (
                  <MovieCard key={item.id} content={item} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={(newPage) => {
                  updateParams({ page: newPage });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </section>
      ) : (
        /* Default Curated Sections View */
        <div className="space-y-12">
          {/* Spotlight Hero (if trending item available) */}
          {topTrending && (
            <section className="relative overflow-hidden rounded-2xl bg-surface-800 border border-surface-700/60 shadow-2xl">
              <div className="relative z-10 flex flex-col justify-end p-6 sm:p-10 md:w-2/3 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                    🔥 Featured Spotlight
                  </Badge>
                  <Badge variant="warning" className="px-2.5 py-1 text-xs font-bold">
                    ★ {topTrending.rating?.toFixed(1) ?? 'N/A'}
                  </Badge>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {topTrending.title}
                </h2>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                  {topTrending.description}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="text-xs text-text-muted">
                    {topTrending.releaseYear} • {topTrending.type} • {topTrending.language.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Poster image right side / background glow */}
              {topTrending.posterUrl && (
                <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block opacity-40 mix-blend-luminosity overflow-hidden">
                  <img
                    src={topTrending.posterUrl}
                    alt={topTrending.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface-800 to-transparent" />
                </div>
              )}
            </section>
          )}

          {/* Section 1: Trending Now */}
          <DiscoverSection
            title="Trending Now"
            icon="🔥"
            subtitle="Most watched and discussed titles across StreamHub"
            items={trendingData?.trending || []}
            loading={trendingLoading}
          />

          {/* Section 2: Popular & Top Rated */}
          <DiscoverSection
            title="Popular & Top Rated"
            icon="⭐"
            subtitle="Critically acclaimed movies and series"
            items={popularData?.discover.results || []}
            loading={popularLoading}
          />

          {/* Section 3: Recently Added */}
          <DiscoverSection
            title="Recently Added"
            icon="🆕"
            subtitle="Fresh releases just arrived on the platform"
            items={recentData?.recentlyAdded || []}
            loading={recentLoading}
          />

          {/* Section 4: All Catalog Grid */}
          <section className="space-y-6 pt-4 border-t border-surface-700/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Browse All Content</h2>
                <p className="text-xs text-text-muted mt-0.5">Explore the complete StreamHub library</p>
              </div>
            </div>

            {discoverError ? (
              <ErrorState message={discoverError.message} onRetry={() => refetchDiscover()} />
            ) : discoverLoading ? (
              <MovieSkeletonGrid count={12} />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {searchResults.map((item) => (
                    <MovieCard key={item.id} content={item} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  onPageChange={(newPage) => {
                    updateParams({ page: newPage });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Discover;
