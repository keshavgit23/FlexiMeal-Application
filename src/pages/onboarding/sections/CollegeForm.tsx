import React, { useState } from 'react';
import { OnboardingNavigation } from '../../../components/onboarding/OnboardingNavigation';
import { CustomDropdown } from '../../../components/ui-elements/CustomDropdown';
import { useFormValidation } from '../../../hooks/useFormValidation';
import {
  required,
} from '../../../utils/validation';

/**
 * ============================================================================
 * SCREEN 4 — COLLEGE & LOCATION DETAILS
 * ============================================================================
 * Captures student or mess context to personalize nearby meal and mess listings.
 * Fields:
 *   - College Name (interactive input with quick suggestions)
 *   - City (selection with popular college hubs)
 *   - Year / Course (optional, e.g. BCA - TY)
 * ============================================================================
 */

interface CollegeFormProps {
  college: string;
  city: string;
  course: string;
  onChange: (field: 'college' | 'city' | 'course', value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CollegeForm: React.FC<CollegeFormProps> = ({
  college,
  city,
  course,
  onChange,
  onNext,
  onBack,
}) => {
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);

  const popularColleges = [
    'MIT World Peace University, Pune',
    'COEP Technological University, Pune',
    'Fergusson College, Pune',
    'Symbiosis International University, Pune',
    'Sinhgad College of Engineering, Pune',
    'IIT Bombay, Mumbai',
    'BMS College of Engineering, Bengaluru',
  ];

  const popularCities = [
    'Pune',
    'Mumbai',
    'Bengaluru',
    'Delhi NCR',
    'Hyderabad',
    'Kota',
    'Indore',
    'Chennai',
  ];

  const handleSelectCollege = (selected: string) => {
    onChange('college', selected);
    setShowCollegeSuggestions(false);
  };

  const {
    errors,
    validateField,
    clearError,
  } = useFormValidation();
  const handleNext = () => {
    const isCollegeValid = validateField(
      'college',
      required(college, 'College name')
    );

    const isCityValid = validateField(
      'city',
      required(city, 'City')
    );
    if (!isCollegeValid || !isCityValid) {
      return;
    }
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between" id="onboarding-step-college">
      <div className="w-full">
        {/* Step Header */}
        <div className="mb-5">
          <h2
            className="text-2xl font-bold text-[#111827] tracking-tight leading-snug"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            Your College<br />
            <span className="text-[#FF6B00]">Details</span>
          </h2>
          <p
            className="text-sm text-[#4B5563] mt-1.5 leading-normal"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Help us find the best messes and offers near your college campus.
          </p>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 my-2">
          {/* College Name Input */}
          <div className="relative">
            <label
              htmlFor="college-name-input"
              className="block text-xs font-semibold text-[#374151] mb-1.5"
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              College Name
            </label>

            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 text-[#9CA3AF] pointer-events-none text-sm"
                aria-hidden="true"
              >
                <i className="fa-solid fa-building-columns"></i>
              </span>

              <input
                id="college-name-input"
                type="text"
                value={college}
                onFocus={() => setShowCollegeSuggestions(true)}
                onChange={(e) => {
                  onChange('college', e.target.value);
                  if (errors.college) {
                    clearError('college');
                  }
                }}
                placeholder="Enter your college name"
                className="w-full pl-10 pr-9 py-3 min-h-[48px] text-sm text-[#111827] bg-white border border-[#D1D5DB] rounded-xl placeholder-[#9CA3AF] focus:outline-none transition-colors"
                style={{ fontFamily: 'var(--font-family-body)' }}
              />

              <button
                type="button"
                onClick={() => setShowCollegeSuggestions(!showCollegeSuggestions)}
                className="absolute right-3 text-[#9CA3AF] hover:text-[#4B5563] p-1 text-xs"
                aria-label="Toggle college suggestions"
              >
                <i
                  className={`fa-solid fa-chevron-down transition-transform ${showCollegeSuggestions ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                ></i>
              </button>
            </div>
            {errors.college && (
              <p className="text-[11px] text-red-500 mt-1 pl-1">
                {errors.college}
              </p>
            )}
            {/* Quick Suggestions Dropdown */}
            {showCollegeSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Popular Campuses
                </div>
                {popularColleges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectCollege(item)}
                    className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#FFF7ED] hover:text-[#FF6B00] transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-graduation-cap text-[#9CA3AF] text-xs" aria-hidden="true"></i>
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City Selection */}
          <div>
            <CustomDropdown
              id="college-city-select"
              label="City"
              value={city}
              placeholder="Select your city"
              options={popularCities.map((city) => ({
                label: city,
                value: city,
              }))}
              onChange={(value) => {
                onChange('city', value);
                if (errors.city) {
                  clearError('city');
                }
              }}
              icon="fa-solid fa-location-dot"
            />
            {errors.city && (
              <p className="text-[11px] text-red-500 mt-1 pl-1">
                {errors.city}
              </p>
            )}
          </div>

          {/* Year / Course (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="college-course-input"
                className="block text-xs font-semibold text-[#374151]"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                Year / Course <span className="text-[#9CA3AF] font-normal">(Optional)</span>
              </label>
            </div>

            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 text-[#9CA3AF] pointer-events-none text-sm"
                aria-hidden="true"
              >
                <i className="fa-solid fa-graduation-cap"></i>
              </span>

              <input
                id="college-course-input"
                type="text"
                value={course}
                onChange={(e) => onChange('course', e.target.value)}
                placeholder="e.g. BCA - TY, B.Tech - 3rd Yr"
                className="w-full pl-10 pr-4 py-3 min-h-[48px] text-sm text-[#111827] bg-white border border-[#D1D5DB] rounded-xl placeholder-[#9CA3AF] focus:outline-none  transition-colors"
                style={{ fontFamily: 'var(--font-family-body)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <OnboardingNavigation
        onNext={handleNext}
        onBack={onBack}
        nextLabel="Next"
        nextIcon="fa-solid fa-arrow-right"
        idPrefix="college"
      />
    </div>
  );
};
