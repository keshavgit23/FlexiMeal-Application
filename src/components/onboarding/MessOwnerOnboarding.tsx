// src/components/onboarding/MessOwnerOnboarding.tsx
import React from 'react';
import { MessProfile } from '../../pages/onboarding/sections/MessProfile';
import type { OnboardingData } from '../../types/onboarding';

interface MessOwnerOnboardingProps {
  step: number;
  formData: OnboardingData;
  updateFormField: (field: keyof OnboardingData, value: unknown) => void;
  onBackToRole: () => void;
  onComplete: () => void;
}

export const MessOwnerOnboarding: React.FC<MessOwnerOnboardingProps> = ({
  step,
  formData,
  updateFormField,
  onBackToRole,
  onComplete,
}) => {
  if (step === 1) {
    return (
      <MessProfile
        messName={formData.messName || ''}
        messAddress={formData.messAddress || ''}
        messLocation={formData.messLocation || ''}
        messState={formData.messState || ''}
        onChange={updateFormField}
        onNext={onComplete}
        onBack={onBackToRole}
      />
    );
  }

  return null;
};