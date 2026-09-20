import React from 'react';
import type { DietaryPreference } from '../../../types/onboarding';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';

/**
 * ============================================================================
 * SCREEN 5 — FOOD PREFERENCES
 * ============================================================================
 * Allows college students to specify their dietary preference and restrictions:
 *   - Primary preference pills: Veg, Non-Veg, Eggetarian
 *   - Optional special dietary requirements: Jain Food, No Onion / Garlic, Allergy
 * ============================================================================
 */

interface FoodPreferencesProps {
  dietaryPreference: DietaryPreference;
  specialRequirements: string[];
  onSelectPreference: (pref: DietaryPreference) => void;
  onToggleRequirement: (requirement: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FoodPreferences: React.FC<FoodPreferencesProps> = ({
  dietaryPreference,
  specialRequirements,
  onSelectPreference,
  onToggleRequirement,
  onNext,
  onBack,
}) => {
  const preferences: Array<{ id: DietaryPreference; label: string; icon: string }> = [
    { id: 'veg', label: 'Veg', icon: 'fa-solid fa-leaf' },
    { id: 'non_veg', label: 'Non-Veg', icon: 'fa-solid fa-drumstick-bite' },
    { id: 'eggetarian', label: 'Eggetarian', icon: 'fa-solid fa-egg' },
  ];

  const requirements = [
    { id: 'jain', label: 'Jain Food', detail: 'Strict pure-veg preparation' },
    { id: 'no_onion_garlic', label: 'No Onion / No Garlic', detail: 'Satvik meal options' },
    { id: 'allergy', label: 'Allergy / Health Condition', detail: 'Gluten-free, lactose alerts' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between" id="onboarding-step-preferences">
      <div className="w-full">
        {/* Step Header */}
        <div className="mb-5">
          <h2
            className="text-2xl font-bold text-[#111827] tracking-tight leading-snug"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            Food<br />
            <span className="text-[#FF6B00]">Preferences</span>
          </h2>
          <p
            className="text-sm text-[#4B5563] mt-1.5 leading-normal"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Help us suggest meals that match your taste and dietary needs.
          </p>
        </div>

        {/* Section 1: Dietary Preference Pills */}
        <div className="my-3">
          <label
            className="block text-xs font-semibold text-[#374151] mb-2.5"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Dietary Preference
          </label>

          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Dietary preference">
            {preferences.map((item) => {
              const isSelected = dietaryPreference === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectPreference(item.id)}
                  id={`preference-pill-${item.id}`}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-sm'
                      : 'bg-white text-[#374151] border-[#D1D5DB] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  <div className="flex items-center gap-1">
                    <span>{item.label}</span>
                    {isSelected && <i className="fa-solid fa-check text-[10px]" aria-hidden="true"></i>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Special Requirements (Optional) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold text-[#374151]"
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              Special Requirements <span className="text-[#9CA3AF] font-normal">(Optional)</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {requirements.map((req) => {
              const isChecked = specialRequirements.includes(req.id);

              return (
                <button
                  key={req.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => onToggleRequirement(req.id)}
                  id={`requirement-option-${req.id}`}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 ${
                    isChecked
                      ? 'bg-[#FFF7ED] border-[#FDBA74]'
                      : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                      isChecked
                        ? 'bg-[#FF6B00] text-white'
                        : 'border border-[#D1D5DB] bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <i className="fa-solid fa-check text-[10px]"></i>}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p
                      className="text-xs font-semibold text-[#111827]"
                      style={{ fontFamily: 'var(--font-family-body)' }}
                    >
                      {req.label}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">{req.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <OnboardingNavigation
        onNext={onNext}
        onBack={onBack}
        nextLabel="Finish"
        nextIcon="fa-solid fa-arrow-right"
        idPrefix="preferences"
      />
    </div>
  );
};
