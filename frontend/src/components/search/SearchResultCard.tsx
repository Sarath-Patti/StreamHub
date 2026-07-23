import React, { useState } from 'react';
import type { SearchResultItem } from '@/services/search';
import { MovieCard } from '@/components/discover/MovieCard';
import { SearchResultExplanationModal } from './SearchResultExplanationModal';
import { Badge } from '@/components/ui';

interface SearchResultCardProps {
  item: SearchResultItem;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ item }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const { content, searchScore } = item;

  return (
    <div className="relative group">
      {/* Search Score Badge Top Right Overlay */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
        <Badge
          variant="brand"
          className="backdrop-blur-md bg-surface-900/85 text-[10px] font-extrabold px-2 py-0.5 shadow-md"
        >
          {searchScore}% Match
        </Badge>
      </div>

      {/* Small "Why this result?" Button Overlay */}
      <div className="absolute bottom-14 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowExplanation(true);
          }}
          className="rounded-lg bg-surface-900/90 hover:bg-brand-500 text-white text-[10px] font-bold px-2 py-1 border border-surface-600 shadow-md backdrop-blur-md transition-colors flex items-center gap-1"
        >
          <span>🔍</span> Why this result?
        </button>
      </div>

      <MovieCard content={content} />

      {/* Explanation Modal */}
      {showExplanation && (
        <SearchResultExplanationModal item={item} onClose={() => setShowExplanation(false)} />
      )}
    </div>
  );
};
