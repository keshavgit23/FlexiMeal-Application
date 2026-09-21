import React, { useState } from 'react';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

import { OnboardingLayout } from './sections/OnboardingLayout';
import { OnboardingWelcome } from './sections/OnboardingWelcome';
import { ProfileForm } from './sections/ProfileForm';
import { RoleSelector } from './sections/RoleSelector';
import { WelcomeAboard } from './sections/WelcomeAboard';
import { ConsumerOnboarding } from '../../components/onboarding/ConsumerOnboarding';
import { MessOwnerOnboarding } from '../../components/onboarding/MessOwnerOnboarding';
import { saveOnboardingDetails } from '../../apis/saveOnboardingDetails.api';


import type { OnboardingData, UserRole } from '../../types/onboarding';

type OnboardingPhase =
  | 'welcome'
  | 'profile'
  | 'role'
  | 'consumer_flow'
  | 'mess_owner_flow'
  | 'complete'
  | 'aboard';

export const OnboardingPage: React.FC = () => {
  const [phase, setPhase] = useState<OnboardingPhase>('welcome');
  const [subStep, setSubStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    phone: '',
    avatarUrl: '',
    role: 'user',
    profession: '',
    dietaryPreference: 'veg',
    specialRequirements: [],
    messName: '',
    messAddress: '',
    messCity: '',
    messState: '',
  });
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const updateFormField = (field: keyof OnboardingData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleToggleRequirement = (reqId: string) => {
  //   setFormData((prev) => {
  //     const exists = prev.specialRequirements.includes(reqId);
  //     return {
  //       ...prev,
  //       specialRequirements: exists
  //         ? prev.specialRequirements.filter((id) => id !== reqId)
  //         : [...prev.specialRequirements, reqId],
  //     };
  //   });
  // };

  // -------------------------------------------------------------
  // Phase Transitions
  // -------------------------------------------------------------
  const startBranchFlow = () => {
    setSubStep(1); // Reset sub-step when entering a branch
    setPhase(formData.role === 'user' ? 'consumer_flow' : 'mess_owner_flow');
  };

  const handleSkip = () => {
    // Dynamic skip based on active phase
    if (phase === 'consumer_flow' && subStep === 1) setSubStep(2);
    else if (phase === 'consumer_flow' && subStep === 2) setPhase('complete');
    else if (phase === 'mess_owner_flow' && subStep === 1) setPhase('complete');
    else {
      // Common skips 
      if (phase === 'profile') setPhase('role');
      if (phase === 'role') startBranchFlow();
    }
  };

  const resetFlow = () => {
    setPhase('welcome');
    setSubStep(1);
  };

  const handleOnboardingComplete = async () => {
      console.log('ONBOARDING COMPLETE CALLED');
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Token unavailable');
      }
      const response = await saveOnboardingDetails(formData, token);
      if (response.success) {
      console.log('REDIRECTING TO USER HOME');
      navigate('/user');
    }
    } catch (error) {
      console.error('Onboarding submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // -------------------------------------------------------------
  // Dynamic Progress Calculation
  // -------------------------------------------------------------
  let currentStepNumber = 0;
  let totalSteps = 4;
  let isMultiStep = false;

  const roleMaxSteps = formData.role === 'user' ? 4 : 3;

  if (phase === 'profile') {
    isMultiStep = true;
    currentStepNumber = 1;
    totalSteps = roleMaxSteps;
  } else if (phase === 'role') {
    isMultiStep = true;
    currentStepNumber = 2;
    totalSteps = roleMaxSteps;
  } else if (phase === 'consumer_flow') {
    isMultiStep = true;
    currentStepNumber = 2 + subStep; // subStep 1 (College) -> 3, subStep 2 (Food) -> 4
    totalSteps = 4;
  } else if (phase === 'mess_owner_flow') {
    isMultiStep = true;
    currentStepNumber = 2 + subStep; // subStep 1 (Mess Profile) -> 3
    totalSteps = 3;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)]">
      <OnboardingLayout
        showHeaderProgress={isMultiStep}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onSkip={handleSkip}
        canSkip={true}
        footerDotsCurrent={isMultiStep ? currentStepNumber : undefined}
        footerDotsTotal={isMultiStep ? totalSteps : undefined}
      >
        {/* COMMON: WELCOME */}
        {phase === 'welcome' && (
          <OnboardingWelcome onGetStarted={() => setPhase('profile')} />
        )}

        {/* COMMON: PROFILE */}
        {phase === 'profile' && (
          <ProfileForm
            fullName={formData.fullName}
            phone={formData.phone}
            avatarUrl={formData.avatarUrl}
            onChange={updateFormField}
            onNext={() => setPhase('role')}
            onBack={() => setPhase('welcome')}
          />
        )}

        {/* COMMON: ROLE SELECTION */}
        {phase === 'role' && (
          <RoleSelector
            selectedRole={formData.role}
            onSelectRole={(role: UserRole) => updateFormField('role', role)}
            onNext={startBranchFlow}
            onBack={() => setPhase('profile')}
          />
        )}

        {/* BRANCH: CONSUMER */}
        {phase === 'consumer_flow' && (
          <ConsumerOnboarding
            step={subStep}
            formData={formData}
            updateFormField={updateFormField}
            onNextStep={() => setSubStep((s) => s + 1)}
            onPrevStep={() => setSubStep((s) => s - 1)}
            onBackToRole={() => setPhase('role')}
            onComplete={handleOnboardingComplete}
            isLoading={isLoading}
          />
        )}

        {/* BRANCH: MESS OWNER */}
        {phase === 'mess_owner_flow' && (
          <MessOwnerOnboarding
            step={subStep}
            formData={formData}
            updateFormField={updateFormField}
            onBackToRole={() => setPhase('role')}
            onComplete={handleOnboardingComplete}
            isLoading={isLoading}
          />
        )}

        {/* WELCOME ABOARD */}
        {phase === 'aboard' && (
          <WelcomeAboard
            userName={formData.fullName.split(' ')[0] || 'Krish'}
            onReset={resetFlow}
          />
        )}
      </OnboardingLayout>
    </div>
  );
};
