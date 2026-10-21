
const API_URL = import.meta.env.VITE_API_URL;

export interface MealConfirmationsSummary {
  total: number;
  explicitYes: number;
  defaultYes: number;
  no: number;
  pending: number;
  payg: number;
}

export const getMealConfirmationsSummary = async (
  token: string,
  mealId: number
): Promise<MealConfirmationsSummary> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/meals/${mealId}/confirmations/summary`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const resultText = await response.text();
  console.log("getMealConfirmationsSummary response:", resultText);

  let result;
  try {
    result = JSON.parse(resultText);
  } catch (error) {
    throw new Error("Failed to parse meal confirmations summary");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch meal confirmations"
    );
  }

  return result.data;
};
