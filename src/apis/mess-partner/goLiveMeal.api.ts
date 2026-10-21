const API_URL = import.meta.env.VITE_API_URL;

export interface GoLiveMealResponse {
  success: boolean;
  message?: string;
  data?: {
    meal: {
      mealId: number;
      profileId: number;
      status: 'ACTIVE';
    };
  };
}

export const goLiveMeal = async (
  token: string,
  mealId: number
): Promise<GoLiveMealResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals/${mealId}/go-live`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  let result: GoLiveMealResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(result.message || 'Failed to start meal');
  }

  return result;
};