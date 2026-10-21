export type MealType = 'breakfast' | 'lunch' | 'dinner';

// export type FoodType = 'PURE_VEG' | 'VEG_NON_VEG';

// export type AppScreen =
//   | 'SETUP_HUB'
//   | 'MONTHLY_PRICE'
//   | 'MESS_PROFILE'
//   | 'STUDENT_PREVIEW'
//   | 'OPERATIONAL_HOME';

// export type OperationalTab = 'shift' | 'schedule' | 'listing' | 'settings';

// export type OperationalStatusMode = 'NORMAL' | 'EMPTY' | 'COMPLETED' | 'ERROR';

// export interface MessOwnerData {
//   // Onboarding data (completed prior)
//   name: string;
//   location: string;
//   city: string;
//   state: string;

//   // Setup steps to publish
//   monthlyPrice: number | null;
//   description: string;
//   mealAvailability: MealType[];
//   foodType: FoodType;
//   photos: string[];

//   // Publishing status
//   isPublished: boolean;
//   status: 'DRAFT' | 'PUBLISHING' | 'LIVE';
// }

// export interface PortionBreakdownData {
//   subscribed: number;
//   defaultMeals: number;
//   payg: number;
// }

// export interface ShiftData {
//   shiftName: 'Lunch' | 'Dinner' | 'Breakfast';
//   cutoffTimeRemaining: number; // in seconds
//   totalMealsToPrepare: number;
//   portionBreakdown: PortionBreakdownData;
//   menuToCook: string[];
//   nextShift: {
//     name: string;
//     timing: string;
//     expectedMeals: number;
//   };
// }

// export type ViewportSize = '360' | '390' | '430' | 'FULL';
export type FoodType = 'PURE_VEG' | 'VEG_NON_VEG';

export type ListingStatus = 'DRAFT' | 'LIVE';

export type AppScreen =
  | 'SETUP_HUB'
  | 'MONTHLY_PRICE'
  | 'MESS_PROFILE'
  | 'STUDENT_PREVIEW'
  | 'OPERATIONAL_HOME';

export type OperationalTab =
  | 'shift'
  | 'schedule'
  | 'listing'
  | 'settings';

export type OperationalStatusMode =
  | 'NORMAL'
  | 'EMPTY'
  | 'COMPLETED'
  | 'ERROR';

export interface MessOwnerData {
  profileId: number;
  userId: number;

  name: string;
  address: string;
  city: string;
  state: string;

  monthlyPrice: number | null;
  description: string | null;
  foodType: FoodType | null;

  offersBreakfast: boolean;
  offersLunch: boolean;
  offersDinner: boolean;

  listingStatus: ListingStatus;
  publishedAt: string | null;

  photoUrl: string | null;

  profileCompleted: boolean;
}

export interface PortionBreakdownData {
  subscribed: number;
  defaultMeals: number;
  payg: number;
}

export interface ShiftData {
  shiftName: 'Lunch' | 'Dinner' | 'Breakfast';
  cutoffTimeRemaining: number;
  totalMealsToPrepare: number;
  portionBreakdown: PortionBreakdownData;
  menuToCook: string[];
  nextShift: {
    name: string;
    timing: string;
    expectedMeals: number;
  };
}

export type ViewportSize = '360' | '390' | '430' | 'FULL';