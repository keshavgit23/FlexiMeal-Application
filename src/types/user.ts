export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type FoodType = 'Pure Veg' | 'Veg + Non-Veg';

export type MealStatus =
  | 'unresponded'
  | 'explicit_yes'
  | 'explicit_no'
  | 'default_applied_yes'
  | 'default_applied_no';

export type SubscriptionPreference = 'YES' | 'NO';

export interface Subscription {
  id: string;
  messId: string;
  messName: string;
  mealType: MealType;
  monthlyPrice: number;
  defaultPreference: SubscriptionPreference;
  status: 'active' | 'paused';
  startDate: string;
  cutoffTime: string;
}

export interface MessMealDetail {
  mealType: MealType;
  available: boolean;
  monthlyPrice: number;
  paygPrice: number;
  timeWindow: string;
  cutoffTime: string;
  todayMenu: string[];
}

export interface MessReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  mealPlan: string;
}

export interface Mess {
  id: string;
  name: string;
  tagline: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isLive: boolean;
  foodType: FoodType;
  image: string;
  about: string;
  meals: Record<MealType, MessMealDetail>;
  reviews: MessReview[];
  upiId: string;
  speciality: string;
}

export interface ScheduledMeal {
  id: string;
  date: string;
  displayDate: string;
  mealType: MealType;
  messId: string;
  messName: string;
  menu: string[];
  cutoffTime: string;
  status: MealStatus;
  isPayg?: boolean;
  paygPrice?: number;
  confirmationId?: number;
  responseOpen?: boolean;
}

export interface LiveMealResponse {
  id: string;
  date: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  messId: string;
  messName: string;
  menu: string[];
  cutoffTime: string;
  mealStatus: "ACTIVE";
  confirmationId: number;
  response: "YES" | "NO" | null;
  responseOpen: boolean;
}

export interface GetMyLiveMealsResponse {
  success: boolean;
  data: LiveMealResponse[];
}

export interface PaymentRecord {
  id: string;
  messId: string;
  messName: string;
  amount: number;
  date: string;
  utr: string;
  status: 'pending' | 'verified' | 'rejected';
  planType: string;
  rejectionReason?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'cutoff' | 'default_applied' | 'payment' | 'subscription';
  read: boolean;
}

export type ScenarioKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L';

export interface PublishedMess {
  profile_id: number;
  mess_name: string;
  mess_address: string;
  mess_city: string;
  mess_state: string;
  monthly_price: string;
  description: string | null;
  food_type: string;
  offers_breakfast: boolean;
  offers_lunch: boolean;
  offers_dinner: boolean;
  photo_url: string | null;
}

export interface PaygMeal {
  meal_id: number;
  profile_id: number;
  mess_name: string;
  mess_address: string;
  mess_city: string;
  mess_state: string;
  food_type: string;
  photo_url: string | null;

  meal_date: string;
  meal_type: MealType;
  start_time: string;
  end_time: string;
  cutoff_time: string;
  status: 'UPCOMING' | 'ACTIVE';

  price: string | number;
  menu_items: string[];
}