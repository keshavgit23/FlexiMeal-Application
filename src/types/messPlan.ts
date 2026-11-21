export interface MessPlanGeneral {
  plan_id: number;
  profile_id: number;
  plan_name: string;
  target_gender: 'MALE' | 'FEMALE' | 'ALL';
  price: string | number;
  is_active: boolean;
  created_at: string;
  meal_types: ('BREAKFAST' | 'LUNCH' | 'DINNER')[];
}