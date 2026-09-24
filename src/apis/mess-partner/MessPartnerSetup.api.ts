const API_URL = import.meta.env.VITE_API_URL;

export interface MessPartnerSetup {
    user: {
        userId: number;
        fullName: string;
        phone: string;
        avatarUrl?: string | null;
    };

    mess: {
        profileId: number;
        name: string;
        address: string;
        city: string;
        state: string;

        monthlyPrice: number | null;
        description: string | null;
        foodType: string | null;

        offersBreakfast: boolean;
        offersLunch: boolean;
        offersDinner: boolean;

        listingStatus: 'DRAFT' | 'LIVE';
        publishedAt: string | null;

        photoUrl: string | null;
        profileCompleted: boolean;
    };
}

export interface MessPartnerSetupResponse {
    success: boolean;
    data: MessPartnerSetup;
}

export const getMessPartnerSetup = async (
    token: string
): Promise<MessPartnerSetupResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/mess-partner/setup`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const responseText = await response.text();

    console.log('Mess partner setup status:', response.status);
    console.log('Mess partner setup response:', responseText);

    let result: MessPartnerSetupResponse | {
        success: false;
        message?: string;
    };

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        throw new Error(
            'message' in result && result.message
                ? result.message
                : 'Failed to fetch mess partner setup'
        );
    }

    return result as MessPartnerSetupResponse;
};


// Update Monthly Price API
export interface UpdateMonthlyPriceResponse {
    success: boolean;
    data?: {
        profileId: number;
        monthlyPrice: number;
    };
    message?: string;
}

export const updateMonthlyPrice = async (
    token: string,
    monthlyPrice: number
): Promise<UpdateMonthlyPriceResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/mess-partner/setup/price`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                monthlyPrice,
            }),
        }
    );

    const responseText = await response.text();

    console.log('Update monthly price status:', response.status);
    console.log('Update monthly price response:', responseText);

    let result: UpdateMonthlyPriceResponse;

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        throw new Error(
            result.message || 'Failed to update monthly price'
        );
    }

    return result;
};


// Update Mess Profile API
export interface UpdateMessProfilePayload {
    description: string;
    foodType: string;
    offersBreakfast: boolean;
    offersLunch: boolean;
    offersDinner: boolean;
}

export interface UpdateMessProfileResponse {
    success: boolean;
    data?: {
        profileId: number;
        description: string;
        foodType: string;
        offersBreakfast: boolean;
        offersLunch: boolean;
        offersDinner: boolean;
    };
    message?: string;
}

export const updateMessProfile = async (
    token: string,
    payload: UpdateMessProfilePayload
): Promise<UpdateMessProfileResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/mess-partner/setup/profile`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    const responseText = await response.text();

    console.log('Update mess profile status:', response.status);
    console.log('Update mess profile response:', responseText);

    let result: UpdateMessProfileResponse;

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        throw new Error(
            result.message || 'Failed to update mess profile'
        );
    }

    return result;
};

//mess-photo upload

export interface UpdateMessPhotoResponse {
    success: boolean;
    data?: {
        profileId: number;
        photoUrl: string;
    };
    message?: string;
}

export const updateMessPhoto = async (
    token: string,
    photo: File
): Promise<UpdateMessPhotoResponse> => {
    const formData = new FormData();

    formData.append('photo', photo);

    const response = await fetch(
        `${API_URL}/api/v1/mess-partner/setup/photo`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const responseText = await response.text();

    console.log('Update mess photo status:', response.status);
    console.log('Update mess photo response:', responseText);

    let result: UpdateMessPhotoResponse;

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        throw new Error(
            result.message || 'Failed to update mess photo'
        );
    }

    return result;
};