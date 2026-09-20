import React from 'react';

/**
 * ============================================================================
 * ONBOARDING NAVIGATION COMPONENT
 * ============================================================================
 * Standardized navigation footer across onboarding steps.
 * Features:
 *   - Prominent primary CTA button with Font Awesome icon
 *   - Clean, subtle Back button
 *   - Thumb-friendly minimum touch targets (>= 48px)
 *   - Full keyboard accessibility
 * ============================================================================
 */

interface OnboardingNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextIcon?: string; // Font Awesome class name, e.g. "fa-solid fa-arrow-right"
  backIcon?: string;
  isNextDisabled?: boolean;
  isFullWidthNext?: boolean;
  className?: string;
  idPrefix?: string;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextIcon = 'fa-solid fa-arrow-right',
  backIcon = 'fa-solid fa-arrow-left',
  isNextDisabled = false,
  isFullWidthNext = false,
  className = '',
  idPrefix = 'onboarding',
}) => {
  const showBack = Boolean(onBack);

  return (
    <div
      className={`w-full flex items-center gap-3 pt-4 select-none ${className}`}
      id={`${idPrefix}-nav-container`}
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          id={`${idPrefix}-back-btn`}
          className="inline-flex items-center justify-center gap-2 px-4 py-3.5 min-h-[48px] rounded-xl text-sm font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
          style={{ fontFamily: 'var(--font-family-body)' }}
          aria-label={backLabel}
        >
          {backIcon && <i className={`${backIcon} text-xs`} aria-hidden="true"></i>}
          <span>{backLabel}</span>
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        id={`${idPrefix}-next-btn`}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[50px] rounded-xl text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/30 shadow-sm ${
          isFullWidthNext || !showBack ? 'w-full' : 'flex-1'
        } ${
          isNextDisabled
            ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed shadow-none'
            : 'bg-[#FF6B00] hover:bg-[#F97316] active:bg-[#EA580C] shadow-[0_4px_14px_rgba(255,107,0,0.3)] active:translate-y-0.5'
        }`}
        style={{ fontFamily: 'var(--font-family-body)' }}
      >
        <span>{nextLabel}</span>
        {nextIcon && <i className={`${nextIcon} text-sm transition-transform group-hover:translate-x-0.5`} aria-hidden="true"></i>}
      </button>
    </div>
  );
};
