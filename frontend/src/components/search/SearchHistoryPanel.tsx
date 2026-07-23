import React from 'react';

interface SearchHistoryPanelProps {
  recentQueries: string[];
  onSelectQuery: (query: string) => void;
}

export const SearchHistoryPanel: React.FC<SearchHistoryPanelProps> = ({
  recentQueries,
  onSelectQuery,
}) => {
  if (recentQueries.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
        Recent Searches:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {recentQueries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelectQuery(q)}
            className="rounded-lg bg-surface-800/80 hover:bg-surface-700 border border-surface-700/60 px-2.5 py-1 text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1"
          >
            <span>🕒</span> {q}
          </button>
        ))}
      </div>
    </div>
  );
};
