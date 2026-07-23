import React from 'react';
import type { SearchResultItem } from '@/services/search';
import { ScoreBreakdown } from '@/components/intelligence/ScoreBreakdown';
import { Badge, Button } from '@/components/ui';

interface SearchResultExplanationModalProps {
  item: SearchResultItem;
  onClose: () => void;
}

export const SearchResultExplanationModal: React.FC<SearchResultExplanationModalProps> = ({
  item,
  onClose,
}) => {
  const { content, searchScore, explanation } = item;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-surface-600 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 text-xl font-bold">
              🔍
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Why this result?
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Deterministic Search Scoring Engine Evaluation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-text-muted hover:text-white hover:bg-surface-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Item Summary Header */}
        <div className="flex items-center gap-4 bg-surface-900/60 p-4 rounded-xl border border-surface-700/60">
          {content.posterUrl && (
            <img
              src={content.posterUrl}
              alt={content.title}
              className="h-16 w-12 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white truncate">{content.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">
              {content.releaseYear} • {content.type} • ★ {content.rating?.toFixed(1) || 'N/A'}
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <Badge variant="brand" className="px-2.5 py-1 text-xs font-extrabold">
              {searchScore} / 100
            </Badge>
            <span className="text-[10px] text-text-muted mt-1 font-semibold">
              Search Score
            </span>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Search Score Factors
          </h5>
          <ScoreBreakdown
            factors={explanation.factors}
            totalScore={searchScore}
            maxScore={100}
          />
        </div>

        {/* Checkmark Explanations */}
        <div className="space-y-2.5 pt-2 border-t border-surface-700/60">
          <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Relevance Highlights
          </h5>
          <div className="space-y-2">
            {explanation.explanations.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-text-primary">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <span className="leading-tight">{exp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};
