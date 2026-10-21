import React from 'react';

export interface NextShiftProps {
  shiftName: string;
  timing: string;
  expectedMeals: number;
}

export const NextShift: React.FC<NextShiftProps> = ({
  shiftName,
  timing,
  expectedMeals,
}) => {
  return (
    <div className="bg-stone-50 rounded-2xl p-3.5 border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200/80 text-gray-700 flex items-center justify-center text-sm shrink-0">
          <i className="fa-solid fa-moon text-base" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading block">
            Next Shift
          </span>
          <h4 className="text-sm font-bold text-gray-900 font-heading">
            {shiftName}
          </h4>
          <span className="text-[11px] text-gray-500">{timing}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] uppercase font-semibold text-gray-400 block">
          Forecast
        </span>
        <span className="text-sm font-black font-heading text-emerald-800">
          ~{expectedMeals} meals
        </span>
      </div>
    </div>
  );
};
