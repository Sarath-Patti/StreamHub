import React, { useState } from 'react';
import type { SearchFilterState } from '@/services/search';
import type { Genre } from '@/types';
import { Badge, Button } from '@/components/ui';

interface ActiveFiltersBarProps {
  filters: SearchFilterState;
  availableGenres: Genre[];
  onReset: () => void;
  onRemoveGenre: (genreId: string) => void;
  onClearFilter: (key: keyof SearchFilterState) => void;
  onSaveSearch: (name: string) => void;
}

export const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  filters,
  availableGenres,
  onReset,
  onRemoveGenre,
  onClearFilter,
  onSaveSearch,
}) => {
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const activeGenreNames = availableGenres
    .filter((g) => filters.genreIds.includes(g.id))
    .map((g) => ({ id: g.id, name: g.name }));

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.genreIds.length > 0 ||
    Boolean(filters.contentType) ||
    filters.minRating > 0 ||
    Boolean(filters.startYear) ||
    Boolean(filters.language);

  if (!hasActiveFilters) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSaveSearch(saveName.trim());
    setSaveName('');
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-900/80 border border-surface-700/60 p-3.5 rounded-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Active Filters:
        </span>

        {filters.query.trim() && (
          <Badge variant="brand" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
            <span>Query: "{filters.query}"</span>
            <button type="button" onClick={() => onClearFilter('query')} className="hover:text-white font-bold">
              ✕
            </button>
          </Badge>
        )}

        {filters.contentType && (
          <Badge variant="accent" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
            <span>Format: {filters.contentType}</span>
            <button type="button" onClick={() => onClearFilter('contentType')} className="hover:text-white font-bold">
              ✕
            </button>
          </Badge>
        )}

        {filters.minRating > 0 && (
          <Badge variant="warning" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
            <span>Rating: ★ {filters.minRating.toFixed(1)}+</span>
            <button type="button" onClick={() => onClearFilter('minRating')} className="hover:text-white font-bold">
              ✕
            </button>
          </Badge>
        )}

        {filters.startYear && (
          <Badge variant="neutral" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
            <span>Year: {filters.startYear}+</span>
            <button type="button" onClick={() => onClearFilter('startYear')} className="hover:text-white font-bold">
              ✕
            </button>
          </Badge>
        )}

        {activeGenreNames.map((g) => (
          <Badge key={g.id} variant="neutral" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
            <span>{g.name}</span>
            <button type="button" onClick={() => onRemoveGenre(g.id)} className="hover:text-white font-bold">
              ✕
            </button>
          </Badge>
        ))}

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-text-muted hover:text-white underline ml-1 font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* Save Search Button / Inline Form */}
      {!isSaving ? (
        <button
          type="button"
          onClick={() => setIsSaving(true)}
          className="shrink-0 text-xs font-bold text-brand-300 hover:text-white bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
        >
          <span>💾</span> Save This Search
        </button>
      ) : (
        <form onSubmit={handleSave} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Preset name..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="rounded-lg bg-surface-800 border border-surface-600 px-2.5 py-1 text-xs text-white placeholder-text-muted focus:border-brand-400 focus:outline-none"
            autoFocus
          />
          <Button type="submit" variant="primary" size="sm" className="text-xs py-1 px-2">
            Save
          </Button>
          <button
            type="button"
            onClick={() => setIsSaving(false)}
            className="text-xs text-text-muted hover:text-white"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
};
