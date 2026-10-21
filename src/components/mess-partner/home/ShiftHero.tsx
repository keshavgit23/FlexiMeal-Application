import React from 'react';
import type { ShiftData } from '../../../types/messOnboarding';
import { CutoffTimer } from './CutoffTimer';
import { Headcount } from './HeadCount';
import { PortionBreakdown } from './PortionBreakDown';

export interface ShiftHeroProps {
  shift: ShiftData;
}

export const ShiftHero: React.FC<ShiftHeroProps> = ({ shift }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-700/50 relative overflow-hidden">
      {/* Background glow circle */}
      <div
        className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-4">
        {/* SHIFT TITLE & CUTOFF ROW */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 font-heading block">
              Current Active Shift
            </span>
            <h2 className="text-xl font-black font-heading text-white tracking-tight">
              TODAY'S {shift.shiftName.toUpperCase()} SHIFT
            </h2>
          </div>

          <CutoffTimer initialSeconds={shift.cutoffTimeRemaining} />
        </div>

        {/* HEADCOUNT (PRIMARY VISUAL ELEMENT) */}
        <Headcount count={shift.totalMealsToPrepare} />

        {/* PORTION BREAKDOWN */}
        <PortionBreakdown data={shift.portionBreakdown} />
      </div>
    </div>
  );
};
