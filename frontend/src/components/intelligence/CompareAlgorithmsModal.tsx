import React from 'react';
import type { Content } from '@/types';
import { recommendationService } from '@/services/recommendation';
import { Badge, Button } from '@/components/ui';

interface CompareAlgorithmsModalProps {
  target: Content;
  candidate?: Content;
  onClose: () => void;
}

export const CompareAlgorithmsModal: React.FC<CompareAlgorithmsModalProps> = ({
  target,
  candidate,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const comparisons = recommendationService.compareAlgorithms(target, candidate);
  const subjectTitle = candidate ? candidate.title : target.title;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-surface-600 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 text-xl font-bold">
              📊
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Compare Recommendation Algorithms
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Evaluating <span className="font-semibold text-white">{subjectTitle}</span> across registered strategies
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

        {/* Algorithm Comparison List */}
        <div className="space-y-4">
          {comparisons.map((comp) => {
            const isTop = comp.score >= 85;
            return (
              <div
                key={comp.strategyId}
                className="rounded-xl bg-surface-900/70 border border-surface-700/70 p-4 space-y-3 transition-all hover:border-brand-500/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {comp.strategyName}
                      {comp.strategyId === 'hybrid' && (
                        <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-semibold">
                          Default
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5">{comp.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xl font-black text-white">{comp.score}</span>
                    <Badge variant={isTop ? 'brand' : 'neutral'} className="text-xs font-bold">
                      / {comp.maxScore}
                    </Badge>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-800">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-500',
                      isTop ? 'bg-gradient-to-r from-brand-500 to-accent-500' : 'bg-surface-600',
                    ].join(' ')}
                    style={{ width: `${(comp.score / comp.maxScore) * 100}%` }}
                  />
                </div>

                {/* Strategy Explanation Snippet */}
                {comp.explanations.length > 0 && (
                  <p className="text-xs text-text-secondary leading-snug italic">
                    "{comp.explanations[0]}"
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};
