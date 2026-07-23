import React, { useState } from 'react';
import type { MatchResult } from '@/services/recommendation';
import { ScoreBreakdown } from './ScoreBreakdown';
import { Badge, Button } from '@/components/ui';

interface WhyYoullLikeThisProps {
  matchResult: MatchResult;
}

export const WhyYoullLikeThis: React.FC<WhyYoullLikeThisProps> = ({ matchResult }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden border border-brand-500/20">
      {/* Background glow accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />

      {/* Header with Title and Recommendation Score Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 text-xl font-bold">
            ✨
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Why You'll Like This
            </h2>
            <p className="text-xs text-text-muted">
              Deterministic Content Intelligence Match Engine
            </p>
          </div>
        </div>

        {/* Transparent Recommendation Score Pill */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Match Score
            </span>
            <span className="text-2xl font-black gradient-text">
              {matchResult.score}
              <span className="text-xs font-normal text-text-muted">/100</span>
            </span>
          </div>
          <Badge variant="brand" className="px-3 py-1.5 text-xs font-bold shadow-md shadow-brand-500/20">
            {matchResult.score >= 85 ? 'High Match' : 'Good Match'}
          </Badge>
        </div>
      </div>

      {/* Bullet Explanations */}
      <div className="space-y-3">
        {matchResult.explanations.map((explanation, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm text-text-primary">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold mt-0.5">
              ✓
            </span>
            <span className="leading-snug">{explanation}</span>
          </div>
        ))}
      </div>

      {/* Expandable Score Breakdown Button & Component */}
      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBreakdown((prev) => !prev)}
          className="text-xs text-brand-400 hover:text-brand-300 px-0"
        >
          {showBreakdown ? '▲ Hide Score Breakdown' : '▼ Expand Recommendation Score Breakdown'}
        </Button>

        {showBreakdown && (
          <div className="mt-4 animate-fade-in">
            <ScoreBreakdown
              factors={matchResult.factors}
              totalScore={matchResult.score}
              maxScore={matchResult.maxScore}
            />
          </div>
        )}
      </div>
    </div>
  );
};
