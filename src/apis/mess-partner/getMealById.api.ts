const API_URL = import.meta.env.VITE_API_URL;

export interface MealMenuItem {
  menuItemId: number;
  itemName: string;
}

export interface MealById {
  mealId: number;
  profileId: number;
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  menuItems: MealMenuItem[];
}

export interface GetMealByIdResponse {
  success: boolean;
  data?: MealById;
  message?: string;
}

export const getMealById = async (
  token: string,
  mealId: string
): Promise<GetMealByIdResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals/${mealId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  console.log(
    'Get meal by ID status:',
    response.status
  );

  console.log(
    'Get meal by ID response:',
    responseText
  );

  let result: GetMealByIdResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to get meal'
    );
  }

  return result;
};