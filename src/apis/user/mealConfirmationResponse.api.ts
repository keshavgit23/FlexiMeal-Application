const API_URL = import.meta.env.VITE_API_URL;

export type MealConfirmationResponse = "YES" | "NO";

export interface RespondToMealConfirmationResponse {
  success: boolean;
  message: string;
  data: {
    confirmation_id: number;
    meal_id: number;
    response: MealConfirmationResponse;
    responded_at: string;
  };
}

export const respondToMealConfirmation = async (
  token: string,
  confirmationId: number,
  response: MealConfirmationResponse
): Promise<RespondToMealConfirmationResponse> => {
  const result = await fetch(
    `${API_URL}/api/v1/user/meal-confirmations/${confirmationId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response }),
    }
  );

  const data = await result.json();

  if (!result.ok) {
    throw new Error(
      data.message || "Failed to update meal confirmation"
    );
  }

  return data;
};