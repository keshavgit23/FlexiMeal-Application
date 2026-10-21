
const API_URL = import.meta.env.VITE_API_URL;

export const getPaygMeals = async (token: string) => {
  const response = await fetch(
    `${API_URL}/api/v1/user/payg/meals`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch PAYG meals"
    );
  }

  return result;
};
