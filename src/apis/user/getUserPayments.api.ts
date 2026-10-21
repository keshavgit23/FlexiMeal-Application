const API_URL = import.meta.env.VITE_API_URL;

export const getMyPayments = async (token: string) => {
  const response = await fetch(`${API_URL}/api/v1/user/payments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch payments');
  }

  return result;
};