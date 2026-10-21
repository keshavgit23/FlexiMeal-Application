import React from 'react';
import type { ScheduledMeal, MealStatus} from '../../types/user';
import type { ActiveSubscription } from '../../apis/user/subscriptions.api';

interface MealConfirmationProps {
  meal: ScheduledMeal;
  subscription?: ActiveSubscription;
  onConfirm: (status: MealStatus) => void;
  showCompact?: boolean;
}

export const MealConfirmation: React.FC<MealConfirmationProps> = ({
  meal,
  subscription,
  onConfirm,
  showCompact = false,
}) => {
  const defaultPref = subscription?.default_response || 'YES';

  // Capitalize meal name
  const formattedMealType = meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);

  if (showCompact) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-sm text-[#111827]">
              {meal.displayDate} · {formattedMealType}
            </span>
            {meal.isPayg && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#FF6B00] border border-[#FFEDD5]">
                PAYG
              </span>
            )}
          </div>
          <span className="text-xs text-[#6B7280]">Cutoff: {meal.cutoffTime}</span>
        </div>
        <div className="text-xs text-[#4B5563] truncate mb-2.5">
          {meal.messName} · {meal.menu.slice(0, 3).join(' • ')}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-[#F3F4F6]">
          <span className="text-xs font-medium text-[#6B7280]">Status:</span>
          {meal.status === 'unresponded' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onConfirm('explicit_yes')}
                className="px-3 py-1 text-xs font-semibold rounded-md bg-[#16A34A] text-white active:scale-95 transition-transform"
              >
                YES
              </button>
              <button
                onClick={() => onConfirm('explicit_no')}
                className="px-3 py-1 text-xs font-semibold rounded-md bg-[#F3F4F6] text-[#4B5563] active:scale-95 transition-transform"
              >
                NO
              </button>
            </div>
          ) : meal.status === 'explicit_yes' ? (
            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <i className="fa-solid fa-circle-check"></i> Confirmed YES
            </span>
          ) : meal.status === 'explicit_no' ? (
            <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
              <i className="fa-solid fa-circle-xmark text-[#DC2626]"></i> Confirmed NO
            </span>
          ) : (
            <span className="text-xs font-medium text-[#F59E0B] flex items-center gap-1">
              <i className="fa-solid fa-clock-rotate-left"></i> Default {meal.status.includes('yes') ? 'YES' : 'NO'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
            {meal.displayDate}'s {formattedMealType}
          </span>
          {meal.isPayg && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#FF6B00] border border-[#FFEDD5]">
              PAYG MEAL
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
          <i className="fa-regular fa-clock text-[11px]"></i>
          <span>Cutoff: {meal.cutoffTime}</span>
        </div>
      </div>

      {/* Mess Name */}
      <h2 className="font-heading font-bold text-xl text-[#111827] mb-1">
        {meal.messName}
      </h2>

      {/* Today's Menu */}
      <div className="text-xs text-[#4B5563] mb-4 bg-[#FFF8EE] rounded-lg p-2.5 border border-[#FFEDD5]">
        <div className="font-semibold text-[#9A3412] mb-0.5 flex items-center gap-1">
          <i className="fa-solid fa-utensils text-[11px]"></i>
          <span>Today's Menu</span>
        </div>
        <p className="leading-relaxed text-[#7C2D12]">
          {meal.menu.join(' • ')}
        </p>
      </div>

      {/* Eating today? Section */}
      <div className="pt-1 border-t border-[#F3F4F6]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wide">
            Eating today?
          </span>

          {/* Status Label */}
          {meal.status === 'explicit_yes' && (
            <span className="text-xs font-semibold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#D1FAE5] flex items-center gap-1">
              <i className="fa-solid fa-check text-[10px]"></i> Confirmed
            </span>
          )}
          {meal.status === 'explicit_no' && (
            <span className="text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FEE2E2] flex items-center gap-1">
              <i className="fa-solid fa-xmark text-[10px]"></i> Confirmed
            </span>
          )}
          {meal.status === 'default_applied_yes' && (
            <span className="text-xs font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A] flex items-center gap-1">
              <i className="fa-solid fa-clock-rotate-left text-[10px]"></i> YES — Default
            </span>
          )}
          {meal.status === 'default_applied_no' && (
            <span className="text-xs font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded border border-[#E5E7EB] flex items-center gap-1">
              <i className="fa-solid fa-clock-rotate-left text-[10px]"></i> NO — Default
            </span>
          )}
          {meal.status === 'unresponded' && (
            <span className="text-xs font-semibold text-[#FF6B00] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFEDD5] animate-pulse">
              Response Needed
            </span>
          )}
        </div>

        {/* Large YES / NO Touch Controls (Min 48px height) */}
        <div className="grid grid-cols-2 gap-3 mb-2.5">
          {/* YES Button */}
          <button
            onClick={() => onConfirm('explicit_yes')}
            className={`min-h-[50px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] ${
              meal.status === 'explicit_yes'
                ? 'bg-[#16A34A] text-white shadow-sm ring-2 ring-[#16A34A]/20'
                : meal.status === 'default_applied_yes'
                ? 'bg-[#ECFDF5] text-[#16A34A] border-2 border-dashed border-[#16A34A]'
                : 'bg-[#F9FAFB] text-[#374151] border border-[#D1D5DB] hover:bg-[#F3F4F6]'
            }`}
          >
            <i className="fa-solid fa-check text-base"></i>
            <span>YES, I'M EATING</span>
          </button>

          {/* NO Button */}
          <button
            onClick={() => onConfirm('explicit_no')}
            className={`min-h-[50px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] ${
              meal.status === 'explicit_no'
                ? 'bg-[#111827] text-white shadow-sm ring-2 ring-[#111827]/20'
                : meal.status === 'default_applied_no'
                ? 'bg-[#F3F4F6] text-[#4B5563] border-2 border-dashed border-[#6B7280]'
                : 'bg-[#F9FAFB] text-[#374151] border border-[#D1D5DB] hover:bg-[#F3F4F6]'
            }`}
          >
            <i className="fa-solid fa-xmark text-base"></i>
            <span>NOT EATING</span>
          </button>
        </div>

        {/* Status Explanations (Prominent, not hidden in tooltip) */}
        {meal.status === 'unresponded' && (
          <div className="bg-[#FFF8EE] rounded-lg p-2.5 border border-[#FFEDD5] text-xs text-[#7C2D12] flex items-start gap-2">
            <i className="fa-solid fa-circle-exclamation text-[#FF6B00] mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold">Confirm by {meal.cutoffTime}</p>
              <p className="text-[11px] text-[#9A3412] mt-0.5">
                No response? Your default <strong className="underline">{defaultPref}</strong> will be applied automatically at cutoff.
              </p>
            </div>
          </div>
        )}

        {meal.status === 'explicit_yes' && (
          <div className="bg-[#ECFDF5] rounded-lg p-2.5 border border-[#D1FAE5] text-xs text-[#065F46] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-[#16A34A] text-sm shrink-0"></i>
              <span><strong>You're eating today.</strong> Meal token confirmed.</span>
            </div>
            <button
              onClick={() => onConfirm('explicit_no')}
              className="text-[11px] text-[#16A34A] font-semibold underline shrink-0 hover:text-[#047857]"
            >
              Change to NO
            </button>
          </div>
        )}

        {meal.status === 'explicit_no' && (
          <div className="bg-[#F3F4F6] rounded-lg p-2.5 border border-[#E5E7EB] text-xs text-[#4B5563] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-ban text-[#6B7280] text-sm shrink-0"></i>
              <span><strong>Not eating today.</strong> Mess notified not to cook.</span>
            </div>
            <button
              onClick={() => onConfirm('explicit_yes')}
              className="text-[11px] text-[#111827] font-semibold underline shrink-0 hover:text-black"
            >
              Change to YES
            </button>
          </div>
        )}

        {meal.status === 'default_applied_yes' && (
          <div className="bg-[#FEF3C7] rounded-lg p-2.5 border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
            <i className="fa-solid fa-clock-rotate-left text-[#D97706] mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold">YES — Applied by Default</p>
              <p className="text-[11px] text-[#B45309] mt-0.5">
                Your default preference was applied because you didn't respond before the {meal.cutoffTime} cutoff.
              </p>
            </div>
          </div>
        )}

        {meal.status === 'default_applied_no' && (
          <div className="bg-[#F3F4F6] rounded-lg p-2.5 border border-[#E5E7EB] text-xs text-[#4B5563] flex items-start gap-2">
            <i className="fa-solid fa-clock-rotate-left text-[#6B7280] mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold">NO — Applied by Default</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Your default preference was applied because you didn't respond before cutoff.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
