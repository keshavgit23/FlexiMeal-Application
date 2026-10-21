export interface Payment {
  payment_id: number;
  user_id: string;
  profile_id: number;
  amount: string;
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  default_response: 'YES' | 'NO';
  utr: string;
  proof_url: string | null;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  mess_name: string;
}