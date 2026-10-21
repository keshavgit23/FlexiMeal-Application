import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="bg-[#FEF2F2] rounded-2xl border border-[#FEE2E2] p-5 text-center shadow-xs">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center text-lg mb-3">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>

      <h3 className="font-heading font-bold text-base text-[#991B1B] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#B91C1C] leading-relaxed mb-4 max-w-xs mx-auto">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="min-h-[44px] px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform shadow-xs inline-flex items-center gap-2"
      >
        <i className="fa-solid fa-rotate-right text-xs"></i>
        <span>Try Again</span>
      </button>
    </div>
  );
};
