import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';

export interface SetupStatusProps {
  isReadyToPublish: boolean;
}

export const SetupStatus: React.FC<SetupStatusProps> = ({
  isReadyToPublish,
}) => {
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        isReadyToPublish
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base ${
            isReadyToPublish
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
          aria-hidden="true"
        >
          <i
            className={
              isReadyToPublish
                ? 'fa-solid fa-circle-check'
                : 'fa-solid fa-eye-slash'
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status="DRAFT" size="sm" />
            <span className="text-xs font-semibold text-gray-600">
              {isReadyToPublish
                ? 'Ready for Student Review'
                : 'Hidden from students'}
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {isReadyToPublish
              ? 'Your mess information is complete. Preview how it appears to students and take it live whenever you are ready.'
              : 'Students cannot discover your mess yet. Complete the required pricing and profile steps to publish it.'}
          </p>
        </div>
      </div>
    </div>
  );
};
