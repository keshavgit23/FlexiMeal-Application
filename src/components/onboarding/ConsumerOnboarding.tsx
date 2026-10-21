import React from 'react';
import { ProfessionForm } from '../../pages/onboarding/sections/ProfessionForm';
import { FoodPreferences } from '../../pages/onboarding/sections/FoodPreferences';
import type { OnboardingData, DietaryPreference } from '../../types/onboarding';

interface ConsumerOnboardingProps {
  step: number;
  formData: OnboardingData;
  updateFormField: (
    field: keyof OnboardingData,
    value: unknown
  ) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onBackToRole: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export const ConsumerOnboarding: React.FC<ConsumerOnboardingProps> = ({
  step,
  formData,
  updateFormField,
  onNextStep,
  onPrevStep,
  onBackToRole,
  onComplete,
  isLoading,
}) => {
  if (step === 1) {
    return (
      <ProfessionForm
        profession={formData.profession}
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
        onSelectPreference={(pref: DietaryPreference) =>
          updateFormField('dietaryPreference', pref)
        }
        // onNext={onComplete}
          onNext={() => {
        console.log('FOOD PREFERENCES FINISH CLICKED');
        onComplete();
      }}
        onBack={onPrevStep}
        isLoading={isLoading}
      />
    );
  }

  return null;
};
