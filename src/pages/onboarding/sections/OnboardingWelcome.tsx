import React from 'react';
import { LogoPlaceholder } from '../../../components/onboarding/LogoPlaceholder';
import { OnboardingIllustration } from '../../../components/onboarding/OnboardingIllustration';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';

/**
 * ============================================================================
 * SCREEN 1 — WELCOME
 * ============================================================================
 * The introductory screen for FlexiMeal.
 * Features:
 *   - Logo placeholder with brand tagline
 *   - Friendly food & meal illustration
 *   - Bold headline: "Your Mess. Your Choice."
 *   - Value proposition description
 *   - Primary "Get Started ->" button
 *   - Secondary "Already have an account? Sign In" UI text
 * ============================================================================
 */

interface OnboardingWelcomeProps {
  onGetStarted: () => void;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  onGetStarted,
}) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-between text-center pt-2 pb-2 animate-fadeIn"
      id="onboarding-step-welcome"
    >
      {/* Brand & Logo Placeholder */}
      <div className="pt-2 pb-4 mt-6">
        <LogoPlaceholder
          size="md"
          showTagline={true}
          tagline="Better Meals. Happier Days."
        />
      </div>

      {/* Hero Illustration */}
      <div className="w-full my-auto py-2 flex items-center justify-center">
        <OnboardingIllustration
          illustrationType="welcome"
          alt="Student enjoying fresh mess meal with FlexiMeal"
          className="w-full max-w-[280px]"
        />
      </div>

      {/* Copy & Value Proposition */}
      <div className="w-full px-2 mt-2 mb-4 flex flex-col gap-4">
        <h1
          className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          Your Mess.<br />
          <span className="text-[#FF6B00]">Your Choice.</span>
        </h1>

        <p
          className="text-sm text-[#4B5563] leading-relaxed max-w-[310px] mx-auto"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          Discover, choose and enjoy meals from the best messes around you.
        </p>
      </div>

      {/* Primary CTA & Secondary Action */}
      <div className="w-full flex flex-col gap-4">
        <OnboardingNavigation
          onNext={onGetStarted}
          nextLabel="Get Started"
          nextIcon="fa-solid fa-arrow-right"
          isFullWidthNext={true}
          idPrefix="welcome"
        />

        {/* Informational Sign In prompt (UI only) */}
        <p
          className="text-xs text-[#6B7280] mt-3.5 mb-1"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGetStarted}
            className="font-semibold text-[#FF6B00] hover:text-[#EA580C] underline-offset-2 hover:underline focus:outline-none"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
