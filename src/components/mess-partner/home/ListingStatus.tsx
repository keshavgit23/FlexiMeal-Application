import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';

export interface ListingStatusProps {
  monthlyPrice: number | null;
  onEditProfile: () => void;
  onPreviewStudentView: () => void;
}

export const ListingStatus: React.FC<ListingStatusProps> = ({
  monthlyPrice,
  onEditProfile,
  onPreviewStudentView,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm shrink-0 border border-emerald-100">
          <i className="fa-solid fa-store" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold font-heading text-gray-900">
              Live Listing
            </span>
            <StatusBadge status="LIVE" size="sm" />
          </div>
          <div className="text-xs text-gray-600 truncate">
            <span className="font-bold text-gray-900">
              ₹{monthlyPrice?.toLocaleString('en-IN') || '2,200'}
            </span>{' '}
            / month standard rate
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onPreviewStudentView}
          aria-label="Preview public listing"
          className="w-8 h-8 rounded-lg bg-stone-100 text-gray-600 hover:bg-stone-200 flex items-center justify-center text-xs transition"
          title="Student View Preview"
        >
          <i className="fa-solid fa-eye" />
        </button>
        <button
          type="button"
          onClick={onEditProfile}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1"
        >
          <i className="fa-solid fa-pen text-[10px]" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};
