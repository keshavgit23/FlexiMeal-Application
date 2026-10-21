
const API_URL = import.meta.env.VITE_API_URL;

export const approveMessPayment = async (
  paymentId: number,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/payments/${paymentId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to approve payment"
    );
  }

  return result;
};

export const rejectMessPayment = async (
  paymentId: number,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/payments/${paymentId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to reject payment"
    );
  }

  return result;
};