import React from 'react';

export interface PublishBottomSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPublishing?: boolean;
}

export const PublishBottomSheet: React.FC<PublishBottomSheetProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isPublishing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-sheet-title"
    >
      {/* Backdrop click dismiss */}
      <div
        className="absolute inset-0"
        onClick={!isPublishing ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Bottom Sheet Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 border-t border-gray-100 shadow-2xl animate-in slide-in-from-bottom duration-250">
        {/* Drag handle bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

        <div className="text-center">
          {/* Rocket / Publish Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto text-2xl mb-4 shadow-sm">
            <i className="fa-solid fa-rocket" />
          </div>

          <h2
            id="publish-sheet-title"
            className="text-xl font-black text-gray-900 font-heading mb-2 leading-tight"
          >
            Ready to take your mess live?
          </h2>

          <p className="text-sm text-gray-600 max-w-[290px] mx-auto leading-relaxed mb-6">
            Publishing will make your mess visible to students in Kothrud, Pune.
            They will be able to subscribe and book daily shifts.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPublishing}
              className="w-full min-h-[52px] px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base font-heading shadow-md transition flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm" />
                  <span>Publishing your mess...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-check text-emerald-200 text-sm" />
                  <span>Yes, Take Mess Live</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isPublishing}
              className="w-full min-h-[44px] py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
            >
              Keep as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
