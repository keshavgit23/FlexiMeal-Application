import React from 'react';

export interface StickyActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
};
