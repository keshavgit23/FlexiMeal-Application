import { UserButton } from '@clerk/react';

export default function DashboardPage() {
  return (
    <div
      id="dashboard-page"
      className="min-h-screen bg-[var(--color-background)] p-6 flex flex-col items-center justify-center"
    >
      <div
        id="dashboard-card"
        className="w-full max-w-lg p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-resting)] text-center"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-xl)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] flex items-center justify-center">
          <i
            className="fa-solid fa-chart-pie text-2xl text-[var(--color-success)]"
            aria-hidden="true"
          />
        </div>

        <h1
          id="dashboard-title"
          className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-family-heading)] mb-2"
        >
          FlexiMeal Dashboard
        </h1>

        <p
          id="dashboard-subtitle"
          className="text-sm text-[var(--color-text-secondary)] font-[var(--font-family-body)] mb-6"
        >
          Your account is fully authenticated and onboarding is completed.
        </p>

        <div className="flex items-center justify-center pt-4 border-t border-[var(--color-border-subtle)]">
          <UserButton />
        </div>
      </div>
    </div>
  );
}