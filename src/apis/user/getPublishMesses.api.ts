const API_URL = import.meta.env.VITE_API_URL;
import type{ MealType } from "../../types/user";


export interface PublishedMessPlan {
  plan_id: number;
  plan_name: string;
  target_gender: 'MALE' | 'FEMALE' | 'ALL';
  price: number;
  meal_types: MealType[];
}

export interface PublishedMess {
  profile_id: number;
  mess_name: string;
  mess_address: string;
  mess_city: string;
  mess_state: string;
  monthly_price: string | null;
  description: string | null;
  food_type: string;
  offers_breakfast: boolean;
  offers_lunch: boolean;
  offers_dinner: boolean;
  photo_url: string | null;
  upi_id: string | null;
  listing_status: 'DRAFT' | 'LIVE';
  plans: PublishedMessPlan[];
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