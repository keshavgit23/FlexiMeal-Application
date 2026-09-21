const API_URL = import.meta.env.VITE_API_URL;

export interface OnboardingPayload {
    fullName: string;
    phone: string;
    avatarUrl?: string;
    role: 'user' | 'mess_owner';

    profession?: string;
    dietaryPreference?: string;

    messName?: string;
    messAddress?: string;
    messCity?: string;
    messState?: string;
}

export interface OnboardingResponse {
    success: boolean;
    user: {
        role: 'user' | 'mess_owner';
        onboardingCompleted: boolean;
    };
}

export const saveOnboardingDetails = async (
    data: OnboardingPayload,
    token: string
): Promise<OnboardingResponse> => {
   ;
    const response = await fetch(`${API_URL}/api/v1/auth/onboarding`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const responseText = await response.text();

    console.log('Onboarding status:', response.status);
    console.log('Onboarding response:', responseText);

    // const result = await response.json();
    const result = JSON.parse(responseText);

    if (!response.ok) {
        throw new Error(
            result.success ? 'Failed to save onboarding details' : 'Onboarding failed'
        );
    }
    return {
        ...result,
        user: {
            ...result.user,
            role:
                result.user.role === 'user'
                    ? 'student'
                    : result.user.role,
        },
    };
};