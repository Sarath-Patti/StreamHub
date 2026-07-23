import React from 'react';
import type { Content } from '@/types';
import type { MatchResult } from '@/services/recommendation';
import { ScoreBreakdown } from './ScoreBreakdown';
import { Badge, Button } from '@/components/ui';

interface WhyExplanationModalProps {
  target: Content;
  candidate: Content;
  matchResult: MatchResult;
  strategyName: string;
  onClose: () => void;
}

export const WhyExplanationModal: React.FC<WhyExplanationModalProps> = ({
  target,
  candidate,
  matchResult,
  strategyName,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-modal-title"
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
              💡
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Why Recommended?
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Strategy: <span className="font-semibold text-brand-300">{strategyName}</span>
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

        {/* Content Comparison Header */}
        <div className="flex items-center gap-4 bg-surface-900/60 p-4 rounded-xl border border-surface-700/60">
          {candidate.posterUrl && (
            <img
              src={candidate.posterUrl}
              alt={candidate.title}
              className="h-16 w-12 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white truncate">{candidate.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">
              Compared with <span className="text-white font-medium">{target.title}</span>
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <Badge variant="brand" className="px-2.5 py-1 text-xs font-extrabold">
              {matchResult.score} / 100
            </Badge>
            <span className="text-[10px] text-text-muted mt-1 font-semibold">
              Final Score
            </span>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Score Breakdown
          </h5>
          <ScoreBreakdown
            factors={matchResult.factors}
            totalScore={matchResult.score}
            maxScore={matchResult.maxScore}
          />
        </div>

        {/* Deterministic Explanations list */}
        <div className="space-y-2.5 pt-2 border-t border-surface-700/60">
          <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Match Highlights
          </h5>
          <div className="space-y-2">
            {matchResult.explanations.map((exp, idx) => (
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
