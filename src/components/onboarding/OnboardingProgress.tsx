import React from 'react';

/**
 * ============================================================================
 * ONBOARDING PROGRESS COMPONENT
 * ============================================================================
 * Communicates multi-step flow progression clearly:
 *   - Top header with "Step X of Y" + slim orange progress track + optional Skip
 *   - Bottom pill/dot indicators matching the reference design
 * ============================================================================
 */

interface OnboardingProgressProps {
  currentStepNumber: number; // 1-indexed (e.g. 1 to 4)
  totalSteps: number;        // e.g. 4
  onSkip?: () => void;
  canSkip?: boolean;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStepNumber,
  totalSteps,
  onSkip,
  canSkip = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (currentStepNumber / totalSteps) * 100));

  return (
    <div className="w-full select-none" id="onboarding-progress-header">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold text-[#6B7280] tracking-wide"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          Step {currentStepNumber} of {totalSteps}
        </span>

        {canSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-medium text-[#6B7280] hover:text-[#FF6B00] active:text-[#EA580C] px-2 py-1 rounded transition-colors"
            style={{ fontFamily: 'var(--font-family-body)' }}
            id="onboarding-skip-btn"
          >
            Skip
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${currentStepNumber} of ${totalSteps}`}
      >
        <div
          className="h-full bg-[#FF6B00] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface StepDotsProps {
  currentStepNumber: number;
  totalSteps: number;
  className?: string;
}

export const StepDots: React.FC<StepDotsProps> = ({
  currentStepNumber,
  totalSteps,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-2 ${className}`}
      aria-label={`Step indicator: ${currentStepNumber} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepIndex = i + 1;
        const isActive = stepIndex === currentStepNumber;
        const isPast = stepIndex < currentStepNumber;

        return (
          <div
            key={stepIndex}
            className={`transition-all duration-250 ease-out rounded-full ${
              isActive
                ? 'w-6 h-2 bg-[#FF6B00]'
                : isPast
                ? 'w-2 h-2 bg-[#FDBA74]'
                : 'w-2 h-2 bg-[#E5E7EB]'
            }`}
          />
        );
      })}
    </div>
  );
};
