const API_URL = import.meta.env.VITE_API_URL;

export interface CancelMealResponse {
  success: boolean;
  message?: string;
  data?: {
    mealId: number;
    status: 'CANCELLED';
  };
}

export const cancelMeal = async (
  token: string,
  mealId: number
): Promise<CancelMealResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals/${mealId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  let result: CancelMealResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(result.message || 'Failed to cancel meal');
  }

  return result;
};