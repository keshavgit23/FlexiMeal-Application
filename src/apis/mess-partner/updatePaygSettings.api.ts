const API_URL = import.meta.env.VITE_API_URL;

export interface UpdatePaygPrices {
  BREAKFAST?: number;
  LUNCH?: number;
  DINNER?: number;
}

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

export interface UpdatePaygSettingsResponse {
  success: boolean;
  data?: PaygSettings;
  message?: string;
}

export const updatePaygSettings = async (
  token: string,
  prices: UpdatePaygPrices
): Promise<UpdatePaygSettingsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/mess-partner/operational/payg/settings`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prices }),
    }
  );

  const responseText = await response.text();

  console.log('Update PAYG settings status:', response.status);
  console.log('Update PAYG settings response:', responseText);

  let result: UpdatePaygSettingsResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to update PAYG settings'
    );
  }

  return result;
};