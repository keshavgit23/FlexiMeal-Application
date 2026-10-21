import React, { useState } from 'react';
import type { PublishedMess, MealType, SubscriptionPreference } from '../../types/user';

interface SubscriptionModalProps {
  mess: PublishedMess;
  onClose: () => void;
  onConfirm: (messId: string, mealType: MealType, defaultPref: SubscriptionPreference) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  mess,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('LUNCH');
  const [defaultPref, setDefaultPref] = useState<SubscriptionPreference>('YES');

  const availableMealTypes = [
    mess.offers_breakfast && 'BREAKFAST',
    mess.offers_lunch && 'LUNCH',
    mess.offers_dinner && 'DINNER',
  ].filter(Boolean) as MealType[];

  // const selectedMealDetail = mess.meals[selectedMeal];

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      onConfirm(String(mess.profile_id), selectedMeal, defaultPref);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
      {/* Bottom Sheet Container */}
      <div
        className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <div>
            <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wide">
              Step {step} of 3 · Meal Plan
            </span>
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              {step === 1 && 'Choose Meal'}
              {step === 2 && 'Set Default Preference'}
              {step === 3 && 'Review Plan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {/* STEP 1: CHOOSE MEAL */}
          {step === 1 && (
            <div>
              <p className="text-xs text-[#6B7280] mb-3">
                Select which meal to subscribe for at <strong>{mess.mess_name}</strong>.
              </p>

              {/* Informational note on independent subscriptions */}
              <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-xl p-2.5 mb-3 text-xs text-[#9A3412] flex items-start gap-2">
                <i className="fa-solid fa-circle-info text-[#FF6B00] mt-0.5 shrink-0"></i>
                <p>
                  <strong>Independent Meal Subscriptions:</strong> Each meal (Breakfast, Lunch, Dinner) has its own independent subscription and default preference.
                </p>
              </div>

              <div className="space-y-2">
                {availableMealTypes.map((mType) => {
                  const isSelected = selectedMeal === mType;
                  return (
                    <button
                      key={mType}
                      onClick={() => setSelectedMeal(mType)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${isSelected
                        ? 'border-[#DC2626] bg-[#FFF8EE] shadow-xs'
                        : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                            ? 'border-[#DC2626] bg-[#DC2626]'
                            : 'border-[#D1D5DB]'
                            }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <div>
                          <span className="font-heading font-bold text-sm text-[#111827] capitalize block">
                            {mType}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">
                            {mType === 'BREAKFAST' && 'Breakfast available'}
                            {mType === 'LUNCH' && 'Lunch available'}
                            {mType === 'DINNER' && 'Dinner available'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-heading font-bold text-sm text-[#111827]">
                          ₹{Number(mess.monthly_price).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#6B7280] block">/ month</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DEFAULT PREFERENCE */}
          {step === 2 && (
            <div>
              <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-xl p-3 mb-4">
                <span className="text-xs font-bold text-[#9A3412] uppercase tracking-wide block mb-1">
                  Crucial FlexiMeal Concept
                </span>
                <h3 className="font-heading font-bold text-base text-[#7C2D12] mb-1">
                  If you don't respond before the cutoff:
                </h3>
                <p className="text-xs text-[#9A3412] leading-relaxed">
                  "This preference is used automatically when you don't respond before the  meal cutoff."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setDefaultPref('YES')}
                  className={`min-h-[58px] p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${defaultPref === 'YES'
                    ? 'border-[#16A34A] bg-[#ECFDF5] text-[#16A34A] font-bold shadow-xs'
                    : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-base"></i>
                    <span className="font-heading text-sm">Default: YES</span>
                  </div>
                  <span className="text-[10px] text-[#047857]">Assume I'm eating</span>
                </button>

                <button
                  onClick={() => setDefaultPref('NO')}
                  className={`min-h-[58px] p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${defaultPref === 'NO'
                    ? 'border-[#111827] bg-[#F3F4F6] text-[#111827] font-bold shadow-xs'
                    : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-xmark text-base"></i>
                    <span className="font-heading text-sm">Default: NO</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280]">Don't cook for me</span>
                </button>
              </div>

              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                You can still explicitly confirm YES or NO every day in one tap before cutoff.
              </p>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 3 && (
            <div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3 mb-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">Mess Name</span>
                  <span className="font-heading font-bold text-sm text-[#111827]">
                    {mess.mess_name}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">Meal Plan</span>
                  <span className="font-semibold text-xs text-[#111827] capitalize">
                    {selectedMeal} (Daily)
                  </span>
                </div>

                {/* <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">Daily Cutoff</span>
                  <span className="text-xs font-medium text-[#111827]">
                    {selectedMealDetail.cutoffTime}
                  </span>
                </div> */}
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">Meal Availability</span>

                  <span className="text-xs font-medium text-[#16A34A]">
                    Available
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">Default Preference</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${defaultPref === 'YES'
                      ? 'bg-[#ECFDF5] text-[#16A34A]'
                      : 'bg-[#F3F4F6] text-[#111827]'
                      }`}
                  >
                    {defaultPref}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#111827]">Total Monthly Plan</span>
                  <span className="font-heading font-bold text-lg text-[#DC2626]">
                    ₹{Number(mess.monthly_price).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-2.5 text-xs text-[#1E40AF] flex items-start gap-2">
                <i className="fa-solid fa-shield-halved text-[#2563EB] mt-0.5 shrink-0"></i>
                <p>
                  Next, you'll submit payment via mess UPI/QR. The mess will verify your transaction reference.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="min-h-[48px] px-4 rounded-xl border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F3F4F6] active:scale-95 transition-transform"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 min-h-[48px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
          >
            <span>
              {step === 1 && 'Next: Set Default Preference'}
              {step === 2 && 'Next: Review Subscription'}
              {step === 3 && 'Confirm & Proceed to Payment'}
            </span>
            <i className="fa-solid fa-arrow-right text-[11px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
