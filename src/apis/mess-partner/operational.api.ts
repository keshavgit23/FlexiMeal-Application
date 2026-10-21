// const API_URL = import.meta.env.VITE_API_URL;

// export interface CurrentMeal {
//   mealId: number;
//   profileId: number;
//   mealDate: string;
//   mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
//   startTime: string;
//   endTime: string;
//   cutoffTime: string;
//   payAsYouGo: boolean;
//   status: 'ACTIVE';
//   menuItems: {
//     menuItemId: number;
//     itemName: string;
//   }[];
// }

// export interface GetCurrentMealResponse {
//   success: boolean;
//   data?: {
//     activeMeal: boolean;
//     meal: CurrentMeal | null;
//   };
//   message?: string;
// }

// export const getActiveMeal = async (
//   token: string
// ): Promise<GetCurrentMealResponse> => {
//   const response = await fetch(
//     `${API_URL}/api/v1/mess-partner/operational/active-meal`,
//     {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const responseText = await response.text();

//   console.log(
//     'Get active meal status:',
//     response.status
//   );

//   console.log(
//     'Get active meal response:',
//     responseText
//   );

//   let result: GetCurrentMealResponse;

//   try {
//     result = JSON.parse(responseText);
//   } catch {
//     throw new Error('Invalid response from server');
//   }

//   if (!response.ok) {
//     throw new Error(
//       result.message || 'Failed to get active meal'
//     );
//   }

//   return result;
// };

const API_URL = import.meta.env.VITE_API_URL;

export type MealStatus =
  | 'UPCOMING'
  | 'ACTIVE'
  | 'ENDED'
  | 'CANCELLED';

export interface CurrentMeal {
  mealId: number;
  profileId: number;
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  status: MealStatus;
  menuItems: {
    menuItemId: number;
    itemName: string;
  }[];
}

export interface GetCurrentMealResponse {
  success: boolean;
  data?: {
    status: 'NONE' | 'UPCOMING' | 'ACTIVE';
    meal: CurrentMeal | null;
  };
  message?: string;
}

export const getCurrentMeal = async (
  token: string
): Promise<GetCurrentMealResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/current-meal`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  console.log(
    'Get current meal status:',
    response.status
  );

  console.log(
    'Get current meal response:',
    responseText
  );

  let result: GetCurrentMealResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to get current meal'
    );
  }

  return result;
};