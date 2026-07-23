import React from 'react';
import type { SearchFilterState } from '@/services/search';
import type { Genre } from '@/types';

interface SearchFiltersPanelProps {
  filters: SearchFilterState;
  availableGenres: Genre[];
  onChange: (patch: Partial<SearchFilterState>) => void;
}

export const SearchFiltersPanel: React.FC<SearchFiltersPanelProps> = ({
  filters,
  availableGenres,
  onChange,
}) => {
  const toggleGenre = (genreId: string) => {
    const exists = filters.genreIds.includes(genreId);
    const updated = exists
      ? filters.genreIds.filter((id) => id !== genreId)
      : [...filters.genreIds, genreId];
    onChange({ genreIds: updated });
  };

  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <span>⚙️</span> Advanced Search Filters
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Content Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary">Content Format</label>
          <div className="flex gap-2">
            {[
              { label: 'All', value: undefined },
              { label: 'Movie', value: 'MOVIE' },
              { label: 'Series', value: 'SERIES' },
            ].map((opt) => {
              const isSelected = filters.contentType === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ contentType: opt.value as SearchFilterState['contentType'] })}
                  className={[
                    'flex-1 rounded-xl py-1.5 px-3 text-xs font-semibold border transition-all',
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/20'
                      : 'bg-surface-900/60 text-text-secondary border-surface-700 hover:text-white',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum Rating Filter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-text-secondary">Min Rating</span>
            <span className="text-amber-400 font-extrabold">
              {filters.minRating > 0 ? `★ ${filters.minRating.toFixed(1)}+` : 'Any Rating'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="9.5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => onChange({ minRating: parseFloat(e.target.value) })}
            className="w-full accent-brand-400 bg-surface-900 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Year Range Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary">Release Year Era</label>
          <div className="flex gap-2">
            {[
              { label: 'Any Year', start: undefined },
              { label: '2020+', start: 2020 },
              { label: '2015+', start: 2015 },
              { label: '2000+', start: 2000 },
            ].map((era) => {
              const isSelected = filters.startYear === era.start;
              return (
                <button
                  key={era.label}
                  type="button"
                  onClick={() => onChange({ startYear: era.start })}
                  className={[
                    'flex-1 rounded-xl py-1.5 px-2 text-[11px] font-semibold border transition-all truncate',
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-400'
                      : 'bg-surface-900/60 text-text-secondary border-surface-700 hover:text-white',
                  ].join(' ')}
                >
                  {era.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary">Language</label>
          <select
            value={filters.language || ''}
            onChange={(e) => onChange({ language: e.target.value || undefined })}
            className="w-full rounded-xl bg-surface-900 border border-surface-700 px-3 py-1.5 text-xs text-white focus:border-brand-400 focus:outline-none"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="space-y-2 pt-2 border-t border-surface-700/60">
        <label className="text-xs font-bold text-text-secondary">Filter by Genres</label>
        <div className="flex flex-wrap gap-1.5">
          {availableGenres.map((genre) => {
            const isSelected = filters.genreIds.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={[
                  'rounded-lg px-3 py-1 text-xs font-semibold transition-all select-none',
                  isSelected
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/50 font-bold'
                    : 'bg-surface-900/60 text-text-secondary border border-surface-700 hover:text-white',
                ].join(' ')}
              >
                {isSelected && '✓ '}
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
