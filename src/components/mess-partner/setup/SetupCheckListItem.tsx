import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';

export interface SetupChecklistItemProps {
  icon: string; // Font Awesome icon class, e.g. "fa-solid fa-indian-rupee-sign"
  title: string;
  subtitle: string;
  status: 'COMPLETED' | 'PENDING' | 'OPTIONAL';
  onClick?: () => void;
  disabled?: boolean;
  isReadOnly?: boolean; // For completed onboarding rows
  valuePreview?: string;
}

export const SetupChecklistItem: React.FC<SetupChecklistItemProps> = ({
  icon,
  title,
  subtitle,
  status,
  onClick,
  disabled = false,
  isReadOnly = false,
  valuePreview,
}) => {
  const isClickable = !isReadOnly && Boolean(onClick);

  return (
    <div
      onClick={isClickable && !disabled ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isReadOnly
          ? 'bg-gray-50/80 border-gray-200 cursor-default'
          : status === 'COMPLETED'
          ? 'bg-white border-emerald-200 hover:border-emerald-300 shadow-sm cursor-pointer'
          : 'bg-white border-gray-200 hover:border-emerald-600 shadow-sm hover:shadow cursor-pointer active:scale-[0.99]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-2">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-base shrink-0 transition ${
            isReadOnly || status === 'COMPLETED'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
          aria-hidden="true"
        >
          <i className={icon} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-gray-900 font-heading leading-tight">
              {title}
            </h3>
            {valuePreview && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {valuePreview}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-normal line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} size="sm" />
        {isClickable && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition">
            <i className="fa-solid fa-chevron-right text-xs" />
          </div>
        )}
      </div>
    </div>
  );
};
