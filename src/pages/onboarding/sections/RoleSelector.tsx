import React from 'react';
import type { UserRole } from '../../../types/onboarding';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';

/**
 * ============================================================================
 * SCREEN 3 — ROLE SELECTOR
 * ============================================================================
 * Allows user to choose their FlexiMeal experience mode:
 *   - Student: discover messes, explore menus, book meals
 *   - Mess Owner: manage mess profile, update daily menus, manage subscriptions
 *
 * UI-only selection using local React state.
 * ============================================================================
 */

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  onNext,
  onBack,
}) => {
  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      description: 'Find messes, view menus, book meals and more.',
      icon: 'fa-solid fa-graduation-cap',
      badge: 'Popular for Campus',
    },
    {
      id: 'owner' as UserRole,
      title: 'Mess Owner',
      description: 'Manage your mess, update menus and reach students.',
      icon: 'fa-solid fa-store',
      badge: 'Mess Partners',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between" id="onboarding-step-role">
      <div className="w-full">
        {/* Step Header */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold text-[#111827] tracking-tight leading-snug"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            Tell us about<br />
            <span className="text-[#FF6B00]">yourself</span>
          </h2>
          <p
            className="text-sm text-[#4B5563] mt-1.5 leading-normal"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Select your role. This helps us show you the right features and options.
          </p>
        </div>

        {/* Large Selectable Role Cards */}
        <div className="space-y-3.5 my-2" role="radiogroup" aria-label="Select your role">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectRole(role.id)}
                id={`role-card-${role.id}`}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 relative focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/20 cursor-pointer ${
                  isSelected
                    ? 'border-[#FF6B00] bg-[#FFF7ED] shadow-sm'
                    : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#FAF5FF]/30 active:bg-[#F9FAFB]'
                }`}
              >
                {/* Role Icon Avatar */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'bg-[#F3F4F6] text-[#4B5563]'
                  }`}
                  aria-hidden="true"
                >
                  <i className={role.icon}></i>
                </div>

                {/* Role Details */}
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: 'var(--font-family-heading)' }}
                    >
                      {role.title}
                    </h3>
                  </div>

                  <p
                    className="text-xs text-[#4B5563] mt-1 leading-relaxed"
                    style={{ fontFamily: 'var(--font-family-body)' }}
                  >
                    {role.description}
                  </p>
                </div>

                {/* Selection Radio / Checkmark Badge */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white scale-100 shadow-sm'
                      : 'border-2 border-[#D1D5DB] bg-white scale-95'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <i className="fa-solid fa-check text-xs"></i>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Informative Note */}
        <div className="mt-4 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-2.5">
          <i className="fa-solid fa-utensils text-[#FF6B00] text-xs" aria-hidden="true"></i>
          <span className="text-xs text-[#6B7280]">
            You can also switch or link your accounts anytime later in Settings.
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <OnboardingNavigation
        onNext={onNext}
        onBack={onBack}
        nextLabel="Next"
        nextIcon="fa-solid fa-arrow-right"
        isNextDisabled={!selectedRole}
        idPrefix="role"
      />
    </div>
  );
};
