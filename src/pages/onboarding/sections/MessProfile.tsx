// src/pages/onboarding/sections/MessProfile.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faLocationDot, faCity, faMap } from '@fortawesome/free-solid-svg-icons';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';
import type { OnboardingData } from '../../../types/onboarding';

interface MessProfileProps {
  messName: string;
  messAddress: string;
  messLocation: string;
  messState: string;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MessProfile: React.FC<MessProfileProps> = ({
  messName,
  messAddress,
  messLocation,
  messState,
  onChange,
  onNext,
  onBack,
}) => {
  // Follows CollegeForm's validation pattern: prevent Next if fields are empty
  const isFormValid =
    messName.trim() !== '' &&
    messAddress.trim() !== '' &&
    messLocation.trim() !== '' &&
    messState.trim() !== '';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-heading">
          Set up your mess
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
          Add some basic details about your mess to get started.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Mess Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Mess Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-disabled)]">
              <FontAwesomeIcon icon={faStore} />
            </div>
            <input
              type="text"
              value={messName}
              onChange={(e) => onChange('messName', e.target.value)}
              placeholder="Enter your mess name"
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] shadow-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Address
          </label>
          <div className="relative">
            <div className="absolute top-4 left-0 pl-4 pointer-events-none text-[var(--color-text-disabled)]">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <textarea
              value={messAddress}
              onChange={(e) => onChange('messAddress', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Responsive Grid for Location and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Location / City */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Location / City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-disabled)]">
                <FontAwesomeIcon icon={faCity} />
              </div>
              <input
                type="text"
                value={messLocation}
                onChange={(e) => onChange('messLocation', e.target.value)}
                placeholder="Enter your city"
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] shadow-sm"
              />
            </div>
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-disabled)]">
                <FontAwesomeIcon icon={faMap} />
              </div>
              <select
                value={messState}
                onChange={(e) => onChange('messState', e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] invalid:text-[var(--color-text-disabled)] shadow-sm"
                required
              >
                <option value="" disabled className="text-[var(--color-text-disabled)]">
                  Select your state
                </option>
                <option value="Maharashtra" className="text-[var(--color-text-primary)]">Maharashtra</option>
                <option value="Karnataka" className="text-[var(--color-text-primary)]">Karnataka</option>
                <option value="Delhi" className="text-[var(--color-text-primary)]">Delhi</option>
                <option value="Gujarat" className="text-[var(--color-text-primary)]">Gujarat</option>
                {/* Additional states can be populated here */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Navigation Component */}
      <div className="mt-8">
        <OnboardingNavigation
          onBack={onBack}
          onNext={onNext}
          isNextDisabled={!isFormValid}
        />
      </div>
    </div>
  );
};