export type UserRole = 'user' | 'mess_owner';
export type DietaryPreference = 'veg' | 'non_veg' | 'vegan' | 'jain' | 'eggetarian';

export interface OnboardingData {
  // Common Data
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;


  // Consumer Specific Data
  profession: string;
  dietaryPreference: DietaryPreference;
  specialRequirements: string[];

  // Mess Owner Specific Data
  messName?: string;
  messPhone?: string;
  messAddress?: string;
  messCity?: string;
  messState?: string;
}
