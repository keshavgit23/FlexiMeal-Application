const API_URL = import.meta.env.VITE_API_URL;

export interface CreateMealPayload {
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  menuItems: string[];
}

export interface CreatedMeal {
  mealId: number;
  profileId: number;
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  status: 'UPCOMING';
  menuItems: string[];
  createdAt: string;
}

export interface CreateMealResponse {
  success: boolean;
  data?: CreatedMeal;
  message?: string;
}

export const createMeal = async (
  token: string,
  payload: CreateMealPayload
): Promise<CreateMealResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await response.text();

  console.log(
    'Create meal status:',
    response.status
  );

  console.log(
    'Create meal response:',
    responseText
  );

  let result: CreateMealResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to create meal'
    );
  }

  return result;
};