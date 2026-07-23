import React from 'react';
import type { ScoreFactor } from '@/services/recommendation';

interface ScoreBreakdownProps {
  factors: ScoreFactor[];
  totalScore: number;
  maxScore: number;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  factors,
  totalScore,
  maxScore,
}) => {
  return (
    <div className="space-y-4 rounded-xl bg-surface-900/60 p-4 border border-surface-700/60 text-xs">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-2.5">
        <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
          Factor Breakdown
        </span>
        <span className="font-semibold text-text-muted">Weight / Max</span>
      </div>

      <div className="space-y-3 font-mono">
        {factors.map((factor) => {
          const pct = Math.round((factor.score / factor.maxScore) * 100);
          return (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="font-sans font-medium text-white">{factor.name}</span>
                <span className="text-brand-300 font-bold">
                  {factor.score} <span className="text-text-muted font-normal">/ {factor.maxScore}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-700/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="font-sans text-[11px] text-text-muted leading-tight">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary Total */}
      <div className="flex items-center justify-between border-t border-surface-700/60 pt-3 font-sans font-bold text-sm text-white">
        <span>Total Match Score</span>
        <span className="gradient-text text-base">
          {totalScore} / {maxScore}
        </span>
      </div>
    </div>
  );
};
