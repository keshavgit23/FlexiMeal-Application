import React, { useState } from 'react';
import type { MessOwnerData } from '../../../types/messOnboarding';
import { StudentPreviewCard } from './StudentPreviewCard';
import { PublishBottomSheet } from '../publish/PublishBottomSheet';
import { StickyActionBar } from '../shared/StickyActionBar';

export interface StudentPreviewProps {
  messData: MessOwnerData;
  onEdit: () => void;
  onPublishSuccess: () => void;
  onBack: () => void;
}

export const StudentPreview: React.FC<StudentPreviewProps> = ({
  messData,
  onEdit,
  onPublishSuccess,
  onBack,
}) => {
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleConfirmPublish = () => {
    setIsPublishing(true);
    // Simulate network latency / publishing operation
    setTimeout(() => {
      setIsPublishing(false);
      setShowConfirmSheet(false);
      onPublishSuccess();
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-100">
      {/* OWNER PREVIEW BANNER */}
      <div className="sticky top-0 z-20 bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Setup Hub"
            className="w-8 h-8 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center text-white transition"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
          </button>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-eye text-emerald-300 text-xs" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 font-heading">
              Student View Preview
            </span>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-semibold">
          Draft Preview
        </span>
      </div>

      {/* BODY */}
      <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full pb-8">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
          <i className="fa-solid fa-circle-check text-emerald-700 text-sm mt-0.5 shrink-0" />
          <span>
            This is an accurate preview of what students will see in their
            FlexiMeal feed. Confirm everything looks right.
          </span>
        </div>

        {/* Student Listing Card */}
        <StudentPreviewCard messData={messData} />
      </main>

      {/* PREVIEW ACTION BAR */}
      <StickyActionBar>
        <div className="flex items-center gap-3">
          {/* 35% Edit Button */}
          <button
            type="button"
            onClick={onEdit}
            className="w-[35%] min-h-[50px] px-3 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-800 font-bold text-sm font-heading hover:bg-gray-50 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-pen-to-square text-xs text-gray-600" />
            <span>Edit</span>
          </button>

          {/* 65% Dominant Publish Button */}
          <button
            type="button"
            onClick={() => setShowConfirmSheet(true)}
            className="w-[65%] min-h-[50px] px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-base font-heading shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-rocket text-emerald-200 text-sm" />
            <span>Publish Mess</span>
          </button>
        </div>
      </StickyActionBar>

      {/* PUBLISH CONFIRMATION BOTTOM SHEET */}
      <PublishBottomSheet
        isOpen={showConfirmSheet}
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowConfirmSheet(false)}
        isPublishing={isPublishing}
      />
    </div>
  );
};
