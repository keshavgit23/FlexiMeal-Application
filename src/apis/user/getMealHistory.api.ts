const API_URL = import.meta.env.VITE_API_URL;

export type MealConfirmationValue = 'YES' | 'NO' | 'PENDING';
export type MealBookingStatus = 'BOOKED' | 'COLLECTED' | 'NO_SHOW';

export interface MealHistoryRecord {
  meal_id: number;
  meal_date: string;
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  status: 'ACTIVE' | 'ENDED';
  start_at: string;
  end_at: string;
  mess_id: string;
  mess_name: string;
  menu_items: string[];
  confirmation_id: number | null;
  confirmation_status: MealConfirmationValue | null;
  default_response: 'YES' | 'NO' | null;
  is_payg: boolean;
  booking_status: MealBookingStatus | null;
  payg_price: string | number | null;
}

export interface GetMealHistoryResponse {
  success: boolean;
  data: MealHistoryRecord[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const getMealHistory = async (
  token: string,
  limit = 20,
  offset = 0
): Promise<GetMealHistoryResponse> => {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const response = await fetch(
    `${API_URL}/api/v1/user/meals/history?${query.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch meal history');
  }

  return result;
};
