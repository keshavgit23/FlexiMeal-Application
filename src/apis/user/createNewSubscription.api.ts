const API_URL = import.meta.env.VITE_API_URL;

export interface NewSubscriptionRequest {
  profile_id: number;
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  default_response: 'YES' | 'NO';
}

export interface NewSubscription {
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
}

export interface NewSubscriptionResponse {
  success: boolean;
  data: NewSubscription;
  message?: string;
}

export const createNewSubscription = async (
  token: string,
  subscriptionData: NewSubscriptionRequest
): Promise<NewSubscriptionResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/user/subscription/new`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionData),
    }
  );

  const responseText = await response.text();

  console.log(
    'Create subscription status:',
    response.status
  );

  console.log(
    'Create subscription response:',
    responseText
  );

  let result: NewSubscriptionResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to create subscription'
    );
  }

  return result;
};