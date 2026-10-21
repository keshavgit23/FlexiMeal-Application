const API_URL = import.meta.env.VITE_API_URL;

export interface UpdateMealPayload {
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  menuItems: string[];
}

export interface UpdateMealResponse {
  success: boolean;
  data?: {
    mealId: number;
    profileId: number;
    mealDate: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    startTime: string;
    endTime: string;
    cutoffTime: string;
    payAsYouGo: boolean;
    status: 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
    menuItems: string[];
    updatedAt: string;
  };
  message?: string;
}

export const updateMeal = async (
  token: string,
  mealId: string,
  payload: UpdateMealPayload
): Promise<UpdateMealResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals/${mealId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await response.text();

  console.log(
    'Update meal status:',
    response.status
  );

  console.log(
    'Update meal response:',
    responseText
  );

  let result: UpdateMealResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to update meal'
    );
  }

  return result;
};