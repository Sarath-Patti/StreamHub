import React from 'react';
import type { Genre, ContentType } from '@/types';

export type SortByOption = 'createdAt' | 'rating' | 'releaseYear' | 'title';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string;
  onGenreSelect: (genreName: string) => void;
  selectedType: ContentType | 'ALL';
  onTypeSelect: (type: ContentType | 'ALL') => void;
  sortBy: SortByOption;
  onSortChange: (sortBy: SortByOption) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
  selectedType,
  onTypeSelect,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter Bar: Content Type Pills & Sort Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-700/60 pb-3">
        {/* Content Type Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl bg-surface-800 p-1 border border-surface-700/60">
          {(['ALL', 'MOVIE', 'SERIES'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeSelect(type)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none',
                selectedType === type
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-text-secondary hover:text-white hover:bg-surface-700/50',
              ].join(' ')}
            >
              {type === 'ALL' ? 'All Types' : type === 'MOVIE' ? 'Movies' : 'Series'}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by-select" className="text-xs font-medium text-text-muted">
            Sort by:
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortByOption)}
            className="rounded-xl bg-surface-800 border border-surface-700/60 px-3 py-1.5 text-xs font-medium text-white focus:border-brand-400 focus:outline-none"
          >
            <option value="createdAt">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="releaseYear">Release Year</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Genre Chips Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onGenreSelect('')}
          className={[
            'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all select-none border',
            !selectedGenre
              ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm shadow-brand-500/20'
              : 'bg-surface-800 text-text-secondary border-surface-700/80 hover:border-surface-600 hover:text-white',
          ].join(' ')}
        >
          All Genres
        </button>

        {genres.map((genre) => {
          const isSelected =
            selectedGenre.toLowerCase() === genre.name.toLowerCase() ||
            selectedGenre === genre.id;

          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => onGenreSelect(genre.name)}
              className={[
                'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all select-none border',
                isSelected
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm shadow-brand-500/20'
                  : 'bg-surface-800 text-text-secondary border-surface-700/80 hover:border-surface-600 hover:text-white',
              ].join(' ')}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
