import React from 'react';
import type { OnboardingData } from '../../../types/onboarding';

interface ProfessionFormProps {
  profession: string;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ProfessionOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const PROFESSION_OPTIONS: ProfessionOption[] = [
  {
    id: 'Student',
    label: 'Student',
    description: 'Enrolled in college, university, or coaching institutes',
    icon: 'fa-solid fa-graduation-cap',
  },
  {
    id: 'Working Professional',
    label: 'Working Professional',
    description: 'Employed full-time or part-time at an organization',
    icon: 'fa-solid fa-briefcase',
  },
  {
    id: 'Intern',
    label: 'Intern',
    description: 'Pursuing an internship, apprenticeship, or traineeship',
    icon: 'fa-solid fa-laptop-code',
  },
  {
    id: 'Self-employed',
    label: 'Self-employed',
    description: 'Freelancer, consultant, entrepreneur, or business owner',
    icon: 'fa-solid fa-user-tie',
  },
  {
    id: 'Other',
    label: 'Other',
    description: 'Job seeker, homemaker, or other occupation',
    icon: 'fa-solid fa-shapes',
  },
];

export const ProfessionForm: React.FC<ProfessionFormProps> = ({
  profession,
  onChange,
  onNext,
  onBack,
}) => {
  const isValid = Boolean(profession && profession.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <div id="profession-form-container" className="w-full max-w-xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-3">
          <i className="fa-solid fa-user-tag text-xl"></i>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          What describes you best?
        </h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
          Help us personalize your meal schedules, subscriptions, and recommendations.
        </p>
      </div>

      {/* Profession selection options */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-3" role="radiogroup" aria-label="Select your profession">
          {PROFESSION_OPTIONS.map((option) => {
            const isSelected = profession === option.id;
            return (
              <button
                key={option.id}
                id={`profession-option-${option.id.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange('profession', option.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50/50 shadow-sm ring-2 ring-red-600/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-base transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 group-hover:text-gray-900'
                    }`}
                  >
                    <i className={option.icon}></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-base">
                      {option.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>

                <div className="ml-3 flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-600'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex items-center justify-between gap-4">
          <button
            id="profession-back-button"
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Back</span>
          </button>

          <button
            id="profession-next-button"
            type="submit"
            disabled={!isValid}
            className={`px-7 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
              isValid
                ? 'bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-md shadow-red-600/20 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Continue</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </form>
    </div>
  );
};
