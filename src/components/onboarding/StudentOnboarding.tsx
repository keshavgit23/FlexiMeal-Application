// src/components/onboarding/StudentOnboarding.tsx
import React from 'react';
import { CollegeForm } from '../../pages/onboarding/sections/CollegeForm';
import { FoodPreferences } from '../../pages/onboarding/sections/FoodPreferences';
import type { OnboardingData, DietaryPreference } from '../../types/onboarding';

interface StudentOnboardingProps {
  step: number;
  formData: OnboardingData;
  updateFormField: (field: keyof OnboardingData, value: unknown) => void;
  onToggleRequirement: (reqId: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onBackToRole: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  step,
  formData,
  updateFormField,
  onToggleRequirement,
  onNextStep,
  onPrevStep,
  onBackToRole,
  onComplete,
  isLoading,
}) => {
  if (step === 1) {
    return (
      <CollegeForm
        college={formData.college}
        city={formData.city}
        course={formData.course}
        onChange={updateFormField}
        onNext={onNextStep}
        onBack={onBackToRole}
      />
    );
  }

  if (step === 2) {
    return (
      <FoodPreferences
        dietaryPreference={formData.dietaryPreference}
        specialRequirements={formData.specialRequirements}
        onSelectPreference={(pref: DietaryPreference) =>
          updateFormField('dietaryPreference', pref)
        }
        onToggleRequirement={onToggleRequirement}
        onNext={onComplete}
        onBack={onPrevStep}
        isLoading={isLoading}
      />
    );
  }

  return null;
};