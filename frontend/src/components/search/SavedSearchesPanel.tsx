import React from 'react';
import type { SavedSearch } from '@/services/search';

interface SavedSearchesPanelProps {
  savedSearches: SavedSearch[];
  onApply: (saved: SavedSearch) => void;
  onDelete: (id: string) => void;
}

export const SavedSearchesPanel: React.FC<SavedSearchesPanelProps> = ({
  savedSearches,
  onApply,
  onDelete,
}) => {
  if (savedSearches.length === 0) return null;

  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <span>💾</span> Saved Search Presets
        </h3>
        <span className="text-xs text-brand-300 font-semibold">
          {savedSearches.length} saved
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {savedSearches.map((saved) => (
          <div
            key={saved.id}
            className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-700/60 hover:border-brand-500/40 transition-all"
          >
            <div
              className="flex-1 cursor-pointer min-w-0 mr-2"
              onClick={() => onApply(saved)}
            >
              <h4 className="text-xs font-bold text-white hover:text-brand-300 transition-colors truncate">
                {saved.name}
              </h4>
              <p className="text-[10px] text-text-muted mt-0.5">
                Saved {new Date(saved.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onApply(saved)}
                className="text-xs font-bold text-brand-300 hover:text-white bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/30"
              >
                Re-run
              </button>
              <button
                type="button"
                onClick={() => onDelete(saved.id)}
                className="text-xs text-text-muted hover:text-red-400 p-1"
                title="Delete preset"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
