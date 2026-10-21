
const API_URL = import.meta.env.VITE_API_URL;

export interface PaygBookingRequest {
  meal_id: number;
}

export interface PaygBooking {
  booking_id: number;
  user_id: number;
  meal_id: number;
  booking_status: 'BOOKED' | 'COLLECTED' | 'NO_SHOW' | 'CANCELLED';
  booked_at: string;
  updated_at: string;
}

export interface PaygBookingResponse {
  success: boolean;
  data: PaygBooking;
  message?: string;
}

export const createPaygBooking = async (
  token: string,
  bookingData: PaygBookingRequest
): Promise<PaygBookingResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/user/payg/bookings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    }
  );

  const responseText = await response.text();

  console.log('Create PAYG booking status:', response.status);
  console.log('Create PAYG booking response:', responseText);

  let result: PaygBookingResponse;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to book PAYG meal'
    );
  }

  return result;
};
