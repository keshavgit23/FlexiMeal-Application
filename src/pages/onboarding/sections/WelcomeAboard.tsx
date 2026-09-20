import React from 'react';
import { LogoPlaceholder } from '../../../components/onboarding/LogoPlaceholder';
import { OnboardingIllustration } from '../../../components/onboarding/OnboardingIllustration';

/**
 * ============================================================================
 * OPTIONAL TRANSITION / LOADING STATE — WELCOME ABOARD
 * ============================================================================
 * Visual confirmation transition depicted in the reference design:
 *   - FlexiMeal logo
 *   - Warm steaming meal illustration
 *   - "Welcome aboard! You'll be redirected to your dashboard shortly..."
 *   - Subtle orange spinner ring
 *   - Replay control for local prototype review
 * ============================================================================
 */

interface WelcomeAboardProps {
  userName?: string;
  onReset: () => void;
}

export const WelcomeAboard: React.FC<WelcomeAboardProps> = ({
  onReset,
}) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-between text-center pt-3 pb-4 animate-fadeIn"
      id="onboarding-welcome-aboard"
    >
      {/* Brand Header */}
      <div className="pt-2">
        <LogoPlaceholder size="md" showTagline={false} />
      </div>

      {/* Steaming Bowl Illustration */}
      <div className="my-auto py-2 flex items-center justify-center w-full">
        <OnboardingIllustration
          illustrationType="loading"
          alt="Steaming fresh mess meal"
          className="w-full max-w-[200px]"
        />
      </div>

      {/* Messaging & Spinner */}
      <div className="w-full px-4 mb-6">
        <h2
          className="text-2xl font-extrabold text-[#111827] tracking-tight leading-snug mb-2"
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          Welcome aboard!
        </h2>
        <p
          className="text-sm text-[#6B7280] leading-relaxed max-w-[280px] mx-auto mb-6"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          You&apos;ll be redirected to your dashboard shortly...
        </p>

        {/* Subtle orange circular spinner */}
        <div className="flex justify-center items-center py-2" aria-label="Loading dashboard">
          <div className="w-9 h-9 border-[3px] border-[#FFEDD5] border-t-[#FF6B00] rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Local UI reset action for testing */}
      <div className="w-full pt-2">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-[#6B7280] hover:text-[#FF6B00] underline-offset-4 hover:underline py-2 transition-colors"
        >
          <i className="fa-solid fa-rotate-left mr-1.5" aria-hidden="true"></i>
          Replay Onboarding Experience
        </button>
      </div>
    </div>
  );
};
