import React from 'react';
import { OnboardingIllustration } from '../../../components/onboarding/OnboardingIllustration';
import type { OnboardingData } from '../../../types/onboarding';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';

/**
 * ============================================================================
 * SCREEN 6 — COMPLETION
 * ============================================================================
 * Final onboarding confirmation screen.
 * Features:
 *   - Success check illustration with confetti celebration
 *   - Bold headline: "You're all set!"
 *   - Supporting message: "Your FlexiMeal profile is ready."
 *   - Clean profile summary card of configured preferences
 *   - Primary CTA: "Continue to FlexiMeal" (updates local UI demo state)
 * ============================================================================
 */

interface OnboardingCompleteProps {
  data: OnboardingData;
  onContinue: () => void;
  onReset: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  data,
  onContinue,
  onReset,
}) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-between text-center pt-4 pb-2 animate-fadeIn"
      id="onboarding-step-complete"
    >
      <div className="w-full flex flex-col items-center">
        {/* Celebration Illustration */}
        <div className="my-3 py-2 flex justify-center w-full">
          <OnboardingIllustration
            illustrationType="success"
            alt="FlexiMeal onboarding complete checkmark celebration"
            className="w-full max-w-[220px]"
          />
        </div>

        {/* Heading & Subtitle */}
        <div className="px-2 mt-2 mb-4">
          <h2
            className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight mb-2"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            You&apos;re <span className="text-[#FF6B00]">all set!</span>
          </h2>
          <p
            className="text-sm text-[#4B5563] leading-relaxed max-w-[290px] mx-auto"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Your FlexiMeal profile has been created. Welcome to better daily meals!
          </p>
        </div>

        {/* Local Summary Badge Card */}
        <div className="w-full bg-[#FFF7ED] border border-[#FDBA74]/50 rounded-2xl p-4 text-left shadow-xs">
          <div className="flex items-center justify-between border-b border-[#FED7AA] pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs">
                <i className="fa-solid fa-user" aria-hidden="true"></i>
              </span>
              <span className="text-sm font-bold text-[#111827]">
                {data.fullName || 'Student Explorer'}
              </span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#EA580C] bg-white px-2 py-0.5 rounded-full border border-[#FED7AA]">
              {data.role === 'mess_owner' ? 'Mess Owner' : 'Student'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#4B5563]">
            <div>
              <span className="text-[11px] text-[#9CA3AF] block">Campus</span>
              <span className="font-medium text-[#1F2937] truncate block">
                {data.college || 'Pune Campuses'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9CA3AF] block">Dietary</span>
              <span className="font-medium text-[#1F2937] capitalize block">
                {data.dietaryPreference || 'Veg Preference'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA & Replay Action */}
      <div className="w-full mt-4">
        <OnboardingNavigation
          onNext={onContinue}
          nextLabel="Continue to FlexiMeal"
          nextIcon="fa-solid fa-arrow-right"
          isFullWidthNext={true}
          idPrefix="complete"
        />

        <button
          type="button"
          onClick={onReset}
          className="mt-3 text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center justify-center gap-1.5 mx-auto py-1 transition-colors"
          title="Restart onboarding flow to test from beginning"
        >
          <i className="fa-solid fa-rotate-left text-[11px]" aria-hidden="true"></i>
          <span>Restart Onboarding Walkthrough</span>
        </button>
      </div>
    </div>
  );
};
