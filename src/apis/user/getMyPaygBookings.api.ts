const API_URL = import.meta.env.VITE_API_URL;

export interface PaygBooking {
    booking_id: number;
    booking_status: 'BOOKED' | 'COLLECTED' | 'NO_SHOW' | 'CANCELLED';
    booked_at: string;
    updated_at: string;
    meal_id: number;
    profile_id: number;
    meal_date: string;
    meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    start_time: string;
    end_time: string;
    meal_status: 'UPCOMING' | 'ACTIVE';
    price: string | number | null;
    mess_name: string;
    photo_url: string | null;
    listing_status: string;
}

export interface GetMyPaygBookingsResponse {
    success: boolean;
    data: PaygBooking[];
    message?: string;
}

export const getMyPaygBookings = async (
    token: string
): Promise<GetMyPaygBookingsResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/user/payg/bookings`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const responseText = await response.text();

    let result: GetMyPaygBookingsResponse;

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch PAYG bookings');
    }

    return result;
};