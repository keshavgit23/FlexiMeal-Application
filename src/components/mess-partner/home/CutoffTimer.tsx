import React, { useEffect, useState } from 'react';

export interface CutoffTimerProps {
  initialSeconds?: number;
}

export const CutoffTimer: React.FC<CutoffTimerProps> = ({
  initialSeconds = 2535, // ~42 mins 15 secs
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold">
      <i className="fa-solid fa-clock text-[11px] text-amber-300 animate-pulse" />
      <span className="text-gray-300 font-medium">Cutoff:</span>
      <span className="font-mono font-bold text-white tracking-wider">
        {formatTime(secondsLeft)}
      </span>
      <span className="text-[10px] text-emerald-300">remaining</span>
    </div>
  );
};
