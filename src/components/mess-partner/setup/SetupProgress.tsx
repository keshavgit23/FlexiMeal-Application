import React from 'react';

export interface SetupProgressProps {
  progressPercent: number; // 0 - 100
  completedCount: number;
  totalRequired: number;
}

export const SetupProgress: React.FC<SetupProgressProps> = ({
  progressPercent,
  completedCount,
  totalRequired,
}) => {
  const isComplete = progressPercent >= 100;

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-4.5 shadow-md relative overflow-hidden">
      {/* Decorative subtle pattern in background */}
      <div
        className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-[11px] font-semibold text-emerald-200 tracking-wide uppercase mb-2">
              <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />
              <span>Get your mess live</span>
            </div>
            <h2 className="text-lg font-bold font-heading text-white leading-tight">
              {isComplete ? 'Ready to Publish!' : 'Complete required setup'}
            </h2>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-[260px] leading-relaxed">
              {isComplete
                ? 'All mandatory details are set. Preview your listing to go live.'
                : 'Complete the required steps before publishing your listing.'}
            </p>
          </div>

          <div className="text-right shrink-0 bg-emerald-800/60 border border-emerald-700/50 px-3 py-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block tracking-wider">
              Progress
            </span>
            <span className="text-2xl font-black font-heading text-white">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-[11px] font-medium text-emerald-200 mb-1.5">
            <span>
              {completedCount} of {totalRequired} steps finished
            </span>
            <span>
              {isComplete ? '100% complete' : `${100 - progressPercent}% remaining`}
            </span>
          </div>
          <div
            className="w-full h-2.5 bg-emerald-950/70 rounded-full overflow-hidden p-0.5 border border-emerald-700/40"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isComplete
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-gradient-to-r from-amber-400 to-emerald-400'
              }`}
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
