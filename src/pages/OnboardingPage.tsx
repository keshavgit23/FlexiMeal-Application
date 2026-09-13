import { UserButton } from '@clerk/react';

export default function OnboardingPage() {
  return (
    <div
      id="onboarding-page"
      className="min-h-screen bg-[var(--color-background)] p-6 flex flex-col items-center justify-center"
    >
      <div
        id="onboarding-card"
        className="w-full max-w-lg p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-resting)] text-center"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-xl)] bg-[var(--primitive-orange-50)] border border-[var(--primitive-orange-100)] flex items-center justify-center">
          <i
            className="fa-solid fa-clipboard-check text-2xl text-[var(--color-secondary)]"
            aria-hidden="true"
          />
        </div>

        <h1
          id="onboarding-title"
          className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-family-heading)] mb-2"
        >
          Welcome to Onboarding
        </h1>

        <p
          id="onboarding-subtitle"
          className="text-sm text-[var(--color-text-secondary)] font-[var(--font-family-body)] mb-6"
        >
          Complete your profile to get started with FlexiMeal.
        </p>

        <div className="flex items-center justify-center pt-4 border-t border-[var(--color-border-subtle)]">
          <UserButton />
        </div>
      </div>
    </div>
  );
}