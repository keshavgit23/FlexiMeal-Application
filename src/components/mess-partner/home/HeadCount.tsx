import React from 'react';

export interface HeadcountProps {
  count: number;
  label?: string;
}

export const Headcount: React.FC<HeadcountProps> = ({
  count,
  label = 'MEALS TO PREPARE',
}) => {
  return (
    <div className="text-center py-2">
      <div className="text-6xl sm:text-7xl font-black font-heading tracking-tight text-white drop-shadow-sm leading-none">
        {count}
      </div>
      <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-300 font-heading mt-2">
        {label}
      </div>
    </div>
  );
};
