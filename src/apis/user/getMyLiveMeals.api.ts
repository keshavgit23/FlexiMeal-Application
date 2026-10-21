
const API_URL = import.meta.env.VITE_API_URL;

export interface LiveMeal {
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
  data: LiveMeal[];
}

export const getMyLiveMeals = async (
  token: string
): Promise<GetMyLiveMealsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/user/meals/live`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch live meals");
  }

  return response.json();
};
