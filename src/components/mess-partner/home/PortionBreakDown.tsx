import React from 'react';
import type { PortionBreakdownData } from '../../../types/messOnboarding';

export interface PortionBreakdownProps {
  data: PortionBreakdownData;
}

export const PortionBreakdown: React.FC<PortionBreakdownProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/60">
      {/* Subscribed */}
      <div className="bg-emerald-950/50 rounded-xl p-2.5 text-center border border-emerald-800/40">
        <span className="text-xl font-black font-heading text-white block leading-tight">
          {data.subscribed}
        </span>
        <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
          Subscribed
        </span>
      </div>

      {/* Default */}
      <div className="bg-emerald-950/50 rounded-xl p-2.5 text-center border border-emerald-800/40">
        <span className="text-xl font-black font-heading text-emerald-100 block leading-tight">
          {data.defaultMeals}
        </span>
        <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
          Default
        </span>
      </div>

      {/* PAYG (Pay As You Go) */}
      <div className="bg-emerald-950/50 rounded-xl p-2.5 text-center border border-emerald-800/40">
        <span className="text-xl font-black font-heading text-amber-300 block leading-tight">
          {data.payg}
        </span>
        <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">
          PAYG
        </span>
      </div>
    </div>
  );
};
