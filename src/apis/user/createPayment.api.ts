const API_URL = import.meta.env.VITE_API_URL;


export const createPayment = async (
  token: string,
  data: {
    profileId: number;
    amount: number;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    defaultResponse: 'YES' | 'NO';
    utr: string;
    proofUrl?: string | null;
  }
) => {
  const response = await fetch(`${API_URL}/api/v1/user/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create payment');
  }

  return result;
};