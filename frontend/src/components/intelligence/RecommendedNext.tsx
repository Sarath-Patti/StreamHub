import React, { useState } from 'react';
import type { Content } from '@/types';
import type { RankedContent, MatchResult } from '@/services/recommendation';
import { recommendationRegistry } from '@/services/recommendation';
import { MovieCard } from '@/components/discover/MovieCard';
import { StrategySelector } from './StrategySelector';
import { WhyExplanationModal } from './WhyExplanationModal';
import { CompareAlgorithmsModal } from './CompareAlgorithmsModal';
import { Badge } from '@/components/ui';

interface RecommendedNextProps {
  targetContent: Content;
  rankedItems: RankedContent[];
  selectedStrategyId: string;
  onStrategyChange: (newStrategyId: string) => void;
  loading?: boolean;
}

export const RecommendedNext: React.FC<RecommendedNextProps> = ({
  targetContent,
  rankedItems,
  selectedStrategyId,
  onStrategyChange,
  loading = false,
}) => {
  const [whyCandidate, setWhyCandidate] = useState<{
    candidate: Content;
    matchResult: MatchResult;
  } | null>(null);

  const [showCompareModal, setShowCompareModal] = useState(false);

  const currentStrategy = recommendationRegistry.get(selectedStrategyId);

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-white">Recommended Next</h2>
          <p className="text-xs text-text-muted">Loading algorithm ranking...</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-800" />
          ))}
        </div>
      </section>
    );
  }

  if (rankedItems.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-surface-700/60 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Recommended Next</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Ranked using <span className="font-semibold text-brand-300">{currentStrategy.name}</span> algorithm ({currentStrategy.description})
          </p>
        </div>
      </div>

      {/* Strategy Selector Bar */}
      <StrategySelector
        selectedStrategyId={selectedStrategyId}
        onSelectStrategy={onStrategyChange}
        onOpenCompareModal={() => setShowCompareModal(true)}
      />

      {/* Recommended Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {rankedItems.map(({ content, matchResult }) => (
          <div key={content.id} className="relative group">
            {/* Match score badge top right */}
            <div className="absolute top-2 right-2 z-20 pointer-events-none">
              <Badge
                variant="brand"
                className="backdrop-blur-md bg-surface-900/80 text-[10px] font-bold px-2 py-0.5"
              >
                {matchResult.score}% Match
              </Badge>
            </div>

            {/* Small "Why?" Explanation Button bottom left overlay */}
            <div className="absolute bottom-14 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWhyCandidate({ candidate: content, matchResult });
                }}
                className="rounded-lg bg-surface-900/90 hover:bg-brand-500 text-white text-[10px] font-bold px-2.5 py-1 border border-surface-600 shadow-md backdrop-blur-md transition-colors flex items-center gap-1"
              >
                <span>💡</span> Why?
              </button>
            </div>

            <MovieCard content={content} />
          </div>
        ))}
      </div>

      {/* "Why?" Explanation Popup Modal */}
      {whyCandidate && (
        <WhyExplanationModal
          target={targetContent}
          candidate={whyCandidate.candidate}
          matchResult={whyCandidate.matchResult}
          strategyName={currentStrategy.name}
          onClose={() => setWhyCandidate(null)}
        />
      )}

      {/* Algorithm Comparison Modal */}
      {showCompareModal && (
        <CompareAlgorithmsModal
          target={targetContent}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </section>
  );
};
