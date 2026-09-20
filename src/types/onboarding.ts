// export type UserRole = 'student' | 'owner' | '';

// export type DietaryPreference = 'veg' | 'non-veg' | 'eggetarian' | '';

// export interface OnboardingData {
//   fullName: string;
//   phone: string;
//   avatarUrl?: string;
//   role: UserRole;
//   college: string;
//   city: string;
//   course: string;
//   dietaryPreference: DietaryPreference;
//   specialRequirements: string[];
// }

// export interface StepConfig {
//   id: number;
//   title: string;
//   subtitle?: string;
//   showStepIndicator: boolean;
//   stepNumber?: number;
//   totalSteps?: number;
//   canSkip?: boolean;
// }
// src/types/onboarding.ts

export type UserRole = 'student' | 'mess_owner';
export type DietaryPreference = 'veg' | 'non_veg' | 'vegan' | 'jain' | 'eggetarian';

export interface OnboardingData {
  // Common Data
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;

  // Student Specific Data
  college: string;
  city: string;
  course: string;
  dietaryPreference: DietaryPreference;
  specialRequirements: string[];

  // Mess Owner Specific Data
  messName?: string;
  messAddress?: string;
  messLocation?: string;
  messState?: string;
}
