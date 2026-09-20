import React from 'react';

/**
 * ============================================================================
 * ONBOARDING LAYOUT COMPONENT
 * ============================================================================
 * Primary container strictly optimized for mobile viewport (360px - 430px).
 * On desktop & tablet viewports, it centers the mobile screen with an elegant,
 * distraction-free shell.
 * ============================================================================
 */

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showHeaderProgress?: boolean;
  currentStepNumber?: number;
  totalSteps?: number;
  onSkip?: () => void;
  canSkip?: boolean;
  className?: string;
  footerDotsCurrent?: number;
  footerDotsTotal?: number;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  showHeaderProgress = false,
  currentStepNumber = 1,
  totalSteps = 4,
  onSkip,
  canSkip = true,
  className = '',
  footerDotsCurrent,
  footerDotsTotal,
}) => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-[#F3F4F6] select-text"
      id="fleximeal-onboarding-shell"
    >
      {/* Mobile-Proportioned Device Container */}
      <main
        className={`w-full sm:max-w-[420px] min-h-screen sm:min-h-[740px] sm:max-h-[920px] sm:rounded-3xl bg-[#FFFDF9] flex flex-col justify-between shadow-xl sm:border sm:border-[#E5E7EB] relative overflow-hidden transition-all duration-300 ${className}`}
        id="onboarding-mobile-container"
      >
        {/* Subtle Decorative Top Gradient Light */}
        <div
          className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FFF7ED] to-transparent pointer-events-none -z-0 opacity-70"
          aria-hidden="true"
        />

        {/* Dynamic Header Progress Bar */}
        {showHeaderProgress && (
          <header className="relative z-10 px-6 pt-6 pb-2">
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
                  id="header-skip-action"
                  className="text-xs font-medium text-[#6B7280] hover:text-[#FF6B00] active:text-[#EA580C] px-2 py-1 -mr-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Skip
                </button>
              )}
            </div>

            <div
              className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={(currentStepNumber / totalSteps) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[#FF6B00] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </header>
        )}

        {/* Scrollable Content Area */}
        <div className="relative z-10 flex-1 flex flex-col px-6 py-4 overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* Bottom Step Dots Indicator if configured */}
        {typeof footerDotsCurrent === 'number' && typeof footerDotsTotal === 'number' && (
          <footer className="relative z-10 pb-5 pt-1 flex justify-center items-center">
            <div
              className="flex items-center justify-center gap-2"
              aria-label={`Step ${footerDotsCurrent} of ${footerDotsTotal}`}
            >
              {Array.from({ length: footerDotsTotal }, (_, i) => {
                const stepNum = i + 1;
                const isCurrent = stepNum === footerDotsCurrent;
                const isDone = stepNum < footerDotsCurrent;

                return (
                  <span
                    key={stepNum}
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-6 h-2 bg-[#FF6B00]'
                        : isDone
                        ? 'w-2 h-2 bg-[#FDBA74]'
                        : 'w-2 h-2 bg-[#E5E7EB]'
                    }`}
                  />
                );
              })}
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};
