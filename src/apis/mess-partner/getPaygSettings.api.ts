const API_URL = import.meta.env.VITE_API_URL;

export interface PaygPrices {
  BREAKFAST: number | null;
  LUNCH: number | null;
  DINNER: number | null;
}

export interface PaygSettings {
  profileId: number;
  prices: PaygPrices;
  updatedAt: string | null;
}

export interface GetPaygSettingsResponse {
  success: boolean;
  data?: PaygSettings;
  message?: string;
}

export const getPaygSettings = async (
  token: string
): Promise<GetPaygSettingsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/payg/settings`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  console.log('Get PAYG settings status:', response.status);
  console.log('Get PAYG settings response:', responseText);

  let result: GetPaygSettingsResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch PAYG settings'
    );
  }

  return result;
};