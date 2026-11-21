const API_URL = import.meta.env.VITE_API_URL;

export interface CreateUpiSettingsPayload {
  upi_id: string;
}

export interface CreateUpiSettingsResponse {
  success: boolean;
  data?: {
    upi_id: string;
  };
  message?: string;
}

export const createUpiSettings = async (
  token: string,
  payload: CreateUpiSettingsPayload
): Promise<CreateUpiSettingsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/payment-settings`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await response.text();

  console.log('Save UPI settings status:', response.status);
  console.log('Save UPI settings response:', responseText);

  let result: CreateUpiSettingsResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to save UPI settings'
    );
  }

  return result;
};