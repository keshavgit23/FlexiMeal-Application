const API_URL = import.meta.env.VITE_API_URL;

export interface PublishedMess {
  profile_id: number;
  mess_name: string;
  mess_address: string;
  mess_city: string;
  mess_state: string;
  monthly_price: string;
  description: string | null;
  food_type: string;
  offers_breakfast: boolean;
  offers_lunch: boolean;
  offers_dinner: boolean;
  photo_url: string | null;
  listing_status: 'DRAFT' | 'LIVE';
}

export const getPublishedMesses = async (token: string) => {
  const response = await fetch(
    `${API_URL}/api/v1/user/messes`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch messes");
  }

  return response.json();
};