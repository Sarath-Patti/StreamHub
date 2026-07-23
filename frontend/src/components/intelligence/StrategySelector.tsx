import React from 'react';
import { recommendationRegistry } from '@/services/recommendation';

interface StrategySelectorProps {
  selectedStrategyId: string;
  onSelectStrategy: (strategyId: string) => void;
  onOpenCompareModal?: () => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  selectedStrategyId,
  onSelectStrategy,
  onOpenCompareModal,
}) => {
  const strategies = recommendationRegistry.getAll();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-800/80 border border-surface-700/60 p-4 rounded-2xl">
      {/* Label and Strategy Pills */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Recommendation Strategy:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {strategies.map((strategy) => {
            const isSelected = selectedStrategyId.toLowerCase() === strategy.id.toLowerCase();
            return (
              <button
                key={strategy.id}
                type="button"
                onClick={() => onSelectStrategy(strategy.id)}
                title={strategy.description}
                className={[
                  'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all select-none',
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30 ring-1 ring-brand-400'
                    : 'bg-surface-700/60 text-text-secondary hover:text-white hover:bg-surface-700',
                ].join(' ')}
              >
                {strategy.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compare Algorithms Button */}
      {onOpenCompareModal && (
        <button
          type="button"
          onClick={onOpenCompareModal}
          className="shrink-0 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-600 px-4 py-2 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>📊</span> Compare Algorithms
        </button>
      )}
    </div>
  );
};
