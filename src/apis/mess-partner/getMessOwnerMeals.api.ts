const API_URL = import.meta.env.VITE_API_URL;

export interface MessOwnerMeal {
  mealId: number;
  profileId: number;
  mealDate: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  startTime: string;
  endTime: string;
  cutoffTime: string;
  payAsYouGo: boolean;
  status: "UPCOMING" | "ACTIVE";
  menuItems: {
    menuItemId: number;
    itemName: string;
  }[];
}

export const getMessOwnerMeals = async (
  token: string
): Promise<MessOwnerMeal[]> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch meals");
  }

  return result.data;
};