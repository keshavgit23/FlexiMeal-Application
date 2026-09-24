import React from 'react';

export interface StatusBadgeProps {
  status: 'DRAFT' | 'LIVE' | 'COMPLETED' | 'PENDING' | 'OPTIONAL';
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  if (status === 'DRAFT') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border border-amber-300 bg-amber-100 text-amber-900 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        {showIcon && (
          <i className="fa-solid fa-file-pen text-amber-700 text-[10px]" />
        )}
        <span>DRAFT</span>
      </span>
    );
  }

  if (status === 'LIVE') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900 shadow-sm ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        {showIcon && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
        )}
        <span>LIVE</span>
      </span>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        }`}
      >
        {showIcon && <i className="fa-solid fa-check text-emerald-600 text-[11px]" />}
        <span>Completed</span>
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-800 ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        }`}
      >
        {showIcon && <i className="fa-solid fa-clock text-amber-600 text-[10px]" />}
        <span>Pending</span>
      </span>
    );
  }

  // OPTIONAL
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border border-gray-200 bg-gray-100 text-gray-600 ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <span>Optional</span>
    </span>
  );
};
