const API_URL = import.meta.env.VITE_API_URL;

export interface UpiSettings {
  upi_id: string | null;
}

export interface GetUpiSettingsResponse {
  success: boolean;
  data?: UpiSettings;
  message?: string;
}

export const getUpiSettings = async (
  token: string
): Promise<GetUpiSettingsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/payment-settings`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  console.log('Get UPI settings status:', response.status);
  console.log('Get UPI settings response:', responseText);

  let result: GetUpiSettingsResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch UPI settings'
    );
  }

  return result;
};