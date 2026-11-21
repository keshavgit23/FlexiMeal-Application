import React from 'react';
import type { MessOwnerData } from '../../../types/messOnboarding';
import { StatusBadge } from '../shared/StatusBadge';
import { SetupProgress } from './SetupProgress';
import { SetupChecklist } from './SetupChecklist';
import { SetupStatus } from './SetupStatus';
import { StickyActionBar } from '../shared/StickyActionBar';

export interface SetupHubProps {
  messData: MessOwnerData;
  onOpenMessPlans: () => void;
  onOpenProfile: () => void;
  onOpenPreview: () => void;
  hasPlans: boolean;
  initialTab: 'shift' | 'listing';
}

export const SetupHub: React.FC<SetupHubProps> = ({
  messData,
  onOpenMessPlans,
  onOpenProfile,
  onOpenPreview,
  hasPlans,
}) => {
const hasMealOffering =
  messData.offersBreakfast ||
  messData.offersLunch ||
  messData.offersDinner;

const isProfileSet =
  Boolean(messData.description?.trim()) && hasMealOffering;

// Onboarding + at least one plan + profile
let completedRequiredCount = 1;

if (hasPlans) completedRequiredCount += 1;
if (isProfileSet) completedRequiredCount += 1;

const totalRequired = 3;

const progressPercent = Math.round(
  (completedRequiredCount / totalRequired) * 100
);

const isReadyToPublish = progressPercent >= 100;

  return (
    <div className="flex flex-col min-h-full bg-stone-50/60">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-gray-900 font-heading truncate tracking-tight">
                {messData.name}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              <i className="fa-solid fa-location-dot text-emerald-700 text-[11px]" />
              <span className="truncate">{messData.address}</span>
            </div>
          </div>

          <div className="text-right shrink-0 flex flex-col items-end">
            <StatusBadge status="DRAFT" size="sm" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT SCROLL AREA */}
      <main className="flex-1 p-4 space-y-5 pb-8">
        {/* Intro banner note */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
          <i className="fa-solid fa-circle-info text-amber-600 text-sm shrink-0" />
          <span>
            Your mess is created! Complete the remaining setup to make it visible
            to students.
          </span>
        </div>

        {/* SETUP PROGRESS */}
        <SetupProgress
          progressPercent={progressPercent}
          completedCount={completedRequiredCount}
          totalRequired={totalRequired}
        />

        {/* CHECKLIST */}
        <SetupChecklist
          messData={messData}
          hasPlans={hasPlans}
          onOpenProfile={onOpenProfile}
          onOpenMessPlans={onOpenMessPlans}
        />

        {/* STATUS CALLOUT */}
        <SetupStatus isReadyToPublish={isReadyToPublish} />
      </main>

      {/* STICKY BOTTOM ACTION */}
      <StickyActionBar>
        {isReadyToPublish ? (
          <button
            type="button"
            onClick={onOpenPreview}
            className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base font-heading shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5"
          >
            <i className="fa-solid fa-eye text-emerald-200 text-sm" />
            <span>Preview &amp; Publish Mess</span>
            <i className="fa-solid fa-arrow-right text-xs ml-1 opacity-80" />
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-gray-200 text-gray-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-lock text-xs" />
              <span>Complete Required Steps to Publish</span>
            </button>
            <p className="text-[11px] text-center text-gray-500 font-medium">
              {!hasPlans && !isProfileSet
                ? 'Create a mess plan and add your profile details above'
                : !hasPlans
                  ? 'Tap "Mess Plans" to create your first plan'
                  : 'Tap "Mess Profile & Meals" to finish setup'}
            </p>
          </div>
        )}
      </StickyActionBar>
    </div>
  );
};
