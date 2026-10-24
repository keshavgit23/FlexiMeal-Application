const API_URL = import.meta.env.VITE_API_URL;

export interface UserProfile {
  user_id: number;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_role: 'mess_owner' | 'user';
  created_at: string;
}

export interface GetMyProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export const getMyProfile = async (
  token: string
): Promise<GetMyProfileResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/user/myProfile`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await response.text();

  let result: GetMyProfileResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch user profile'
    );
  }

  return result;
};
