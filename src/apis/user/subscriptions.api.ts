const API_URL = import.meta.env.VITE_API_URL;

export interface ActiveSubscription {
  subscription_id: number;
  user_id: number;
  profile_id: number;
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  default_response: 'YES' | 'NO';
  status: 'ACTIVE';
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  mess_name: string;
  monthly_price: string | number;
}


export interface GetActiveSubscriptionsResponse {
  success: boolean;
  data: ActiveSubscription[];
  message?: string;
}

export const getMyActiveSubscriptions = async (
  token: string
): Promise<GetActiveSubscriptionsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/user/subscriptions/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  console.log(
    'Get active subscriptions status:',
    response.status
  );

  console.log(
    'Get active subscriptions response:',
    responseText
  );

  let result: GetActiveSubscriptionsResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch active subscriptions'
    );
  }

  return result;
};