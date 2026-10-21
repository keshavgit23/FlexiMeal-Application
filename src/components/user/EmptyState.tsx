import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  suggestions?: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'fa-solid fa-magnifying-glass',
  title,
  description,
  suggestions,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center shadow-xs">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF8EE] text-[#FF6B00] flex items-center justify-center text-xl mb-3">
        <i className={icon}></i>
      </div>

      <h3 className="font-heading font-bold text-lg text-[#111827] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#6B7280] leading-relaxed max-w-xs mx-auto mb-4">
        {description}
      </p>

      {suggestions && suggestions.length > 0 && (
        <div className="text-left bg-[#F9FAFB] rounded-xl p-3 mb-4 border border-[#E5E7EB]">
          <span className="text-[11px] font-bold text-[#374151] block mb-1">
            Try:
          </span>
          <ul className="text-xs text-[#4B5563] space-y-1">
            {suggestions.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="min-h-[44px] px-5 py-2.5 bg-[#DC2626] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform shadow-xs inline-flex items-center justify-center gap-2"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
