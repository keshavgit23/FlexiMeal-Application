import React, { useState } from 'react';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import {
  phone as validatePhone,
  fullName as validateFullName,
} from '../../../utils/validation';

/**
 * ============================================================================
 * SCREEN 2 — PROFILE
 * ============================================================================
 * Allows user to configure basic profile identity:
 *   - Avatar placeholder with camera badge
 *   - Full name input with Font Awesome user icon
 *   - Phone number input with country prefix and phone icon
 * ============================================================================
 */

interface ProfileFormProps {
  fullName: string;
  phone: string;
  avatarUrl?: string;
  onChange: (field: 'fullName' | 'phone' | 'avatarUrl', value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  fullName,
  phone,
  onChange,
  onNext,
  onBack,
}) => {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const {
    errors,
    validateField,
    clearError,
  } = useFormValidation();

  // Friendly avatar color/style cycle for local UI demo
  const avatarPalettes = [
    { bg: 'bg-[#FFEDD5]', text: 'text-[#EA580C]', border: 'border-[#FDBA74]' },
    { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]', border: 'border-[#93C5FD]' },
    { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]', border: 'border-[#6EE7B7]' },
    { bg: 'bg-[#F3E8FF]', text: 'text-[#9333EA]', border: 'border-[#D8B4FE]' },
  ];

  const handleFullNameChange = (value: string) => {
    // Only allow letters and spaces
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');

    onChange('fullName', sanitizedValue);

    if (errors.fullName) {
      clearError('fullName');
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only digits, max 10
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);

    onChange('phone', sanitizedValue);

    if (errors.phone) {
      clearError('phone');
    }
  };

  const handleNext = () => {
    const isNameValid = validateField(
      'fullName',
      validateFullName(fullName)
    );

    const isPhoneValid = validateField(
      'phone',
      validatePhone(phone)
    );

    if (!isNameValid || !isPhoneValid) {
      return;
    }

    onNext();
  };
  const handleAvatarClick = () => {
    setAvatarIndex((prev) => (prev + 1) % avatarPalettes.length);
  };

  const currentPalette = avatarPalettes[avatarIndex];

  return (
    <div className="flex-1 flex flex-col justify-between" id="onboarding-step-profile">
      <div className="w-full">
        {/* Step Title & Subtitle */}
        <div className="mb-5">
          <h2
            className="text-2xl font-bold text-[#111827] tracking-tight leading-snug"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            Let&apos;s set up<br />
            <span className="text-[#FF6B00]">your profile</span>
          </h2>
          <p
            className="text-sm text-[#4B5563] mt-1.5 leading-normal"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            This will help us personalize your experience on FlexiMeal.
          </p>
        </div>

        {/* Profile Avatar Area with Camera Badge */}
        <div className="flex justify-center my-4">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={handleAvatarClick}
              className={`w-24 h-24 rounded-full ${currentPalette.bg} border-2 ${currentPalette.border} flex items-center justify-center shadow-inner cursor-pointer hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/30`}
              title="Click to customize profile avatar (visual demo)"
              aria-label="Upload profile picture"
            >
              {fullName.trim().length > 0 ? (
                <span
                  className={`text-2xl font-extrabold ${currentPalette.text} select-none`}
                  style={{ fontFamily: 'var(--font-family-heading)' }}
                >
                  {fullName
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              ) : (
                <i
                  className={`fa-solid fa-user text-3xl ${currentPalette.text}`}
                  aria-hidden="true"
                ></i>
              )}
            </button>

            {/* Camera Badge Icon */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-md border-2 border-white pointer-events-none"
              aria-hidden="true"
            >
              <i className="fa-solid fa-camera text-xs"></i>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mt-4">
          {/* Full Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-full-name"
              className="block text-xs font-semibold text-[#374151] mb-1.5"
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 text-[#9CA3AF] pointer-events-none text-sm"
                aria-hidden="true"
              >
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 min-h-[48px] text-sm text-[#111827] bg-white border border-[#D1D5DB] rounded-xl placeholder-[#9CA3AF] focus:outline-none transition-colors"
                style={{ fontFamily: 'var(--font-family-body)' }}
              />
            </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-500 mt-1 pl-1">
                  {errors.fullName}
                </p>
              )}
          </div>

          {/* Phone Number Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-phone-number"
              className="block text-xs font-semibold text-[#374151] mb-1.5"
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 text-[#9CA3AF] pointer-events-none text-sm"
                aria-hidden="true"
              >
                <i className="fa-solid fa-phone"></i>
              </span>
              <span
                className="absolute left-9 text-sm font-medium text-[#4B5563] pointer-events-none border-r border-[#E5E7EB] pr-2"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                +91
              </span>
              <input
                id="profile-phone-number"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-22 pr-4 py-3 min-h-[48px] text-sm text-[#111827] bg-white border border-[#D1D5DB] rounded-xl placeholder-[#9CA3AF] focus:outline-none transition-colors"
                style={{ fontFamily: 'var(--font-family-body)' }}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-500 mt-1 pl-1">
                {errors.phone}
              </p>
            )}
            <p className="text-[11px] text-[#9CA3AF] mt-1 pl-1">
              Used for meal booking alerts &amp; mess communication
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <OnboardingNavigation
        onNext={handleNext}
        onBack={onBack}
        nextLabel="Next"
        nextIcon="fa-solid fa-arrow-right"
        idPrefix="profile"
      />
    </div>
  );
};
