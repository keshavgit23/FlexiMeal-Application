// src/pages/onboarding/sections/MessProfile.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faLocationDot, faCity } from '@fortawesome/free-solid-svg-icons';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';
import type { OnboardingData } from '../../../types/onboarding';
import { CustomDropdown } from '../../../components/ui-elements/CustomDropdown';
import { PhoneField } from '../../../components/ui-elements/PhoneFiekd';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { required } from '../../../utils/validation';
import {
  phone as validatePhone,
} from '../../../utils/validation';
interface MessProfileProps {
  messName: string;
  messPhone: string;
  messAddress: string;
  messCity: string;
  messState: string;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const MessProfile: React.FC<MessProfileProps> = ({
  messName,
  messPhone,
  messAddress,
  messCity,
  messState,
  onChange,
  onNext,
  onBack,
  isLoading,
}) => {

  const states = [
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Gujarat',
  ];

  const {
    errors,
    validateField,
    clearError,
  } = useFormValidation();
  const handleMessNameChange = (value: string) => {
    // Only allow letters and spaces
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');

    onChange('messName', sanitizedValue);

    if (errors.messName) {
      clearError('messName');
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only digits, max 10
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    onChange('messPhone', sanitizedValue);

    if (errors.messPhone) {
      clearError('messPhone');
    }
  };
  const handleMessCityChange = (value: string) => {
    onChange('messCity', value);

    if (errors.messCity) {
      clearError('messCity');
    }
  };

  const handleMessStateChange = (value: string) => {
    onChange('messState', value);

    if (errors.messState) {
      clearError('messState');
    }
  };
  const handleMessAddressChange = (value: string) => {
    onChange('messAddress', value);

    if (errors.messAddress) {
      clearError('messAddress');
    }
  };

  const handleNext = () => {
    const isMessNameValid = validateField(
      'messName',
      required(messName, 'Mess name')
    );

    const isPhoneValid = validateField(
      'messPhone',
      validatePhone(messPhone)
    );

    const isAddressValid = validateField(
      'messAddress',
      required(messAddress, 'Address')
    );

    const isLocationValid = validateField(
      'messCity',
      required(messCity, 'City')
    );

    const isStateValid = validateField(
      'messState',
      required(messState, 'State')
    );

    if (
      !isMessNameValid ||
      !isPhoneValid ||
      !isAddressValid ||
      !isLocationValid ||
      !isStateValid
    ) {
      return;
    }

    onNext();
  };

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
              onChange={(e) => handleMessNameChange(e.target.value)}
              placeholder="Enter your mess name"
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] shadow-sm"
            />
          </div>
          {errors.messName && (
            <p className="text-[11px] text-red-500 mt-1 pl-1">
              {errors.messName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <PhoneField
            id="mess-phone"
            value={messPhone}
            onChange={(value) => handlePhoneChange(value)}
            label="Phone Number"
            placeholder="9876543210"
            helperText=""
          />
        </div>
        {errors.messPhone && (
          <p className="text-[11px] text-red-500 mt-1 pl-1">
            {errors.messPhone}
          </p>
        )}

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
              onChange={(e) => handleMessAddressChange(e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] resize-none shadow-sm"
            />
          </div>
          {errors.messAddress && (
            <p className="text-[11px] text-red-500 mt-1 pl-1">
              {errors.messAddress}
            </p>
          )}
        </div>

        {/* Responsive Grid for Location and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative w-full">
          {/* Location / City */}
          <div className="space-y-1.5 min-w-0">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Location / City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-disabled)]">
                <FontAwesomeIcon icon={faCity} />
              </div>
              <input
                type="text"
                value={messCity}
                onChange={(e) => handleMessCityChange(e.target.value)}
                placeholder="Enter your city"
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-border-focus-owner)] focus:border-[var(--color-border-focus-owner)] transition-shadow outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] shadow-sm"
              />
            </div>
            {errors.messCity && (
              <p className="text-[11px] text-red-500 mt-1 pl-1">
                {errors.messCity}
              </p>
            )}
          </div>

          <div className="relative w-full min-w-0">
            {/* State */}
            <CustomDropdown
              id="mess-state-select"
              label="State"
              value={messState}
              placeholder="Select your state"
              options={states.map((state) => ({
                label: state,
                value: state,
              }))}
              onChange={(value) => handleMessStateChange(value)}
              icon="fa-solid fa-map"
            />
          </div>
          {errors.messState && (
            <p className="text-[11px] text-red-500 mt-1 pl-1">
              {errors.messState}
            </p>
          )}
        </div>
      </div>
      {/* Shared Navigation Component */}
      <div className="mt-8">
        <OnboardingNavigation
          onNext={handleNext}
          onBack={onBack}
          nextLabel={isLoading ? 'Saving...' : 'Finish'}
          nextIcon={
            isLoading
              ? 'fa-solid fa-spinner fa-spin'
              : 'fa-solid fa-arrow-right'
          }
        />
      </div>
    </div>
  );
};