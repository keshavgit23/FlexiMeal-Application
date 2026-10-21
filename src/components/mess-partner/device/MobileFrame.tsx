import React from 'react';
import type { ViewportSize } from '../../../types/messOnboarding';

export interface MobileFrameProps {
  children: React.ReactNode;
  viewportSize: ViewportSize;
  onSelectViewport: (size: ViewportSize) => void;
  onResetFlow: () => void;
  isPublished: boolean;
  onTogglePublished: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  viewportSize,
  onSelectViewport,
  onResetFlow,
  isPublished,
  onTogglePublished,
}) => {
  let widthClass = 'w-full max-w-[390px]'; // default 390px
  if (viewportSize === '360') widthClass = 'w-full max-w-[360px]';
  if (viewportSize === '430') widthClass = 'w-full max-w-[430px]';
  if (viewportSize === 'FULL') widthClass = 'w-full max-w-md';

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-start md:py-6 md:px-4">
      {/* Top Test Toolbar (Compact & non-intrusive for testing & verification) */}
      <div className="w-full max-w-lg mb-3 px-3 py-2 bg-stone-800/90 border border-stone-700/80 rounded-xl text-stone-300 text-xs hidden sm:flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-emerald-400 font-heading tracking-wide">
            FlexiMeal
          </span>
          <span className="text-[10px] bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded font-mono">
            {viewportSize === 'FULL'
              ? 'Responsive'
              : `${viewportSize}px`}
          </span>
        </div>

        {/* Viewport size switchers */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-stone-400 mr-1">Width:</span>
          {(['360', '390', '430', 'FULL'] as ViewportSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelectViewport(size)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition ${
                viewportSize === size
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
              }`}
            >
              {size === 'FULL' ? 'Max' : `${size}`}
            </button>
          ))}
        </div>

        {/* Quick state reset / switch */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePublished}
            className={`px-2.5 py-1 rounded text-[11px] font-bold font-heading transition ${
              isPublished
                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                : 'bg-amber-900/80 text-amber-300 border border-amber-600'
            }`}
            title="Toggle between Draft Setup & Published Operational Home"
          >
            <i className="fa-solid fa-arrows-rotate text-[10px] mr-1" />
            <span>{isPublished ? 'State: Live' : 'State: Draft'}</span>
          </button>

          <button
            type="button"
            onClick={onResetFlow}
            className="p-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-300 transition"
            title="Reset to Initial Onboarded Draft"
            aria-label="Reset to initial state"
          >
            <i className="fa-solid fa-rotate-left text-xs" />
          </button>
        </div>
      </div>

      {/* MOBILE DEVICE CONTAINER */}
      <div
        className={`${widthClass} h-screen sm:h-[844px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-8 sm:border-stone-800 transition-all duration-300`}
      >
        {/* Dynamic Mobile Status Bar Header (Simulated PWA Status Bar) */}
        <div className="bg-white px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-bold text-gray-800 select-none shrink-0 z-30">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto hidden sm:block" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <i className="fa-solid fa-signal" />
            <i className="fa-solid fa-wifi" />
            <i className="fa-solid fa-battery-full text-xs" />
          </div>
        </div>

        {/* SCREEN SCROLLABLE VIEWPORT */}
        <div className="flex-1 overflow-y-auto flex flex-col relative no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
