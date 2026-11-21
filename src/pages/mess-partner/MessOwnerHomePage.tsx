import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import Toast from '../../components/ui-elements/Toast';
import { useLocation, useNavigate } from 'react-router-dom';
import type {
  AppScreen,
  FoodType,
  MealType,
  MessOwnerData,
} from '../../types/messOnboarding';
import { getMessPartnerSetup, updateMessProfile, updateMessPhoto } from '../../apis/mess-partner/MessPartnerSetup.api';
import {
  getMessPlans,
  type MessPlan,
} from '../../apis/mess-partner/MessPartnerSetup.api';
import { SetupHub } from '../../components/mess-partner/setup/SetupHub';
import { MessProfileForm } from '../../components/mess-partner/profile/MessProfileForm';
import { StudentPreview } from '../../components/mess-partner/preview/StudentPreview';
import { PublishSuccess } from '../../components/mess-partner/publish/PublishSuccess';
import { OperationalHome } from '../../components/mess-partner/home/OperationalHome';
import type { ToastType } from '../../types/ui-elements/toast';

import {
  createMessPlan,
  type CreateMessPlanPayload,
} from '../../apis/mess-partner/MessPartnerSetup.api';

import { MessPlanScreen } from '../../components/mess-partner/profile/MessPlanScreen';
import MessPlans from '../../components/mess-partner/profile/MessPlansOverview';
import { validateMessPlan } from '../../utils/messPlanValidation';
import { useToast } from "../../context/ToastContext";
import MessPlansOverview from '../../components/mess-partner/profile/MessPlansOverview';

export default function MessOwnerHomePage() {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const [messData, setMessData] = useState<MessOwnerData | null>(null);
  const [currentScreen, setCurrentScreen] =
    useState<AppScreen>('SETUP_HUB');
  const [initialTab, setInitialTab] = useState<'shift' | 'listing'>('shift');

  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [plans, setPlans] = useState<MessPlan[]>([]);
  const [planReturnTo, setPlanReturnTo] = useState<'setup' | 'listing'>('setup');
  const hasPlans = plans.length > 0;
  const location = useLocation();
  const navigate = useNavigate();

  const loadMessPartnerSetup = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      // 1. Load essential mess setup data first
      const response = await getMessPartnerSetup(token);
      const { user, mess } = response.data;

      // 2. Normalize backend response
      const normalizedData: MessOwnerData = {
        name: mess.name,
        address: mess.address,
        city: mess.city,
        state: mess.state,

        monthlyPrice: mess.monthlyPrice,
        description: mess.description ?? '',
        foodType: (mess.foodType ?? '') as FoodType,

        offersBreakfast: mess.offersBreakfast,
        offersLunch: mess.offersLunch,
        offersDinner: mess.offersDinner,

        listingStatus: mess.listingStatus,
        publishedAt: mess.publishedAt,

        profileId: mess.profileId,
        userId: user.userId,

        photoUrl: mess.photoUrl,
        profileCompleted: mess.profileCompleted,
      };

      // 3. Set essential data
      setMessData(normalizedData);

      console.log('NORMALIZED MESS DATA:', normalizedData);

      // 4. Determine which dashboard to show
      setCurrentScreen(
        mess.listingStatus === 'LIVE'
          ? 'OPERATIONAL_HOME'
          : 'SETUP_HUB'
      );

      // 5. Load plans independently
      try {
        const plansResponse = await getMessPlans(token);
        setPlans(plansResponse.data);
      } catch (planError) {
        console.error('Failed to load mess plans:', planError);
        setPlans([]);
      }

    } catch (err) {
      console.error('Failed to load mess partner setup:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load mess setup'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessPartnerSetup();
  }, []);

  // const handleCreateMessPlan = async (
  //   payload: CreateMessPlanPayload
  // ) => {
  //   try {
  //     const token = await getToken();

  //     if (!token) {
  //       throw new Error('Authentication token unavailable');
  //     }

  //     await createMessPlan(token, payload);
  //     const plansResponse = await getMessPlans(token);
  //     setPlans(plansResponse.data);

  //     // Show your existing success toast here.
  //     setCurrentScreen('SETUP_HUB');
  //   } catch (error) {
  //     console.error('Create mess plan error:', error);

  //     // Show your existing error toast here.
  //   }
  // };
  const handleCreateMessPlan = async (
    payload: CreateMessPlanPayload
  ) => {
    const validation = validateMessPlan(payload);

    if (!validation.isValid) {
      // Use your existing error toast mechanism.
      // You can also pass validation.errors to the form.
      const firstError = Object.values(validation.errors)[0];

      showToast(firstError || 'Please check the form', 'error');
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token unavailable');
      }

      await createMessPlan(token, payload);

      const plansResponse = await getMessPlans(token);
      setPlans(plansResponse.data);

      setCurrentScreen('SETUP_HUB');
      if (planReturnTo === 'listing') {
        setCurrentScreen('OPERATIONAL_HOME');
        setInitialTab('listing');
      }
    } catch (error) {
      console.error('Create mess plan error:', error);
      // Existing error toast
      showToast('Failed to create mess plan', 'error');
    }
  };

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);
  const handleSaveProfile = async (profileData: {
    description: string;
    mealAvailability: MealType[];
    foodType: FoodType;
    // photo: File | null;
  }) => {
    if (!messData) return;

    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const payload = {
        description: profileData.description,
        foodType: profileData.foodType,
        offersBreakfast: profileData.mealAvailability.includes('breakfast'),
        offersLunch: profileData.mealAvailability.includes('lunch'),
        offersDinner: profileData.mealAvailability.includes('dinner'),
      };

      const response = await updateMessProfile(token, payload);

      if (!response.success) {
        throw new Error(
          response.message || 'Failed to update mess profile'
        );
      }

      // 2. Upload photo only if user selected one
      // let photoUrl = messData.photoUrl;


      // if (profileData.photo) {
      //   const photoResponse = await updateMessPhoto(
      //     token,
      //     profileData.photo
      //   );

      //   if (!photoResponse.success) {
      //     throw new Error(
      //       photoResponse.message || 'Failed to upload mess photo'
      //     );
      //   }

      //   photoUrl = photoResponse.data?.photoUrl ?? null;
      // }
      setMessData((prev) =>
        prev
          ? {
            ...prev,
            description: profileData.description,
            mealAvailability: profileData.mealAvailability,
            foodType: profileData.foodType,

            // Important
            offersBreakfast: payload.offersBreakfast,
            offersLunch: payload.offersLunch,
            offersDinner: payload.offersDinner,

            profileCompleted: true,
            // photoUrl,
          }
          : prev
      );

      // Show success toast
      setToast({
        type: 'success',
        message: 'Mess profile saved successfully',
      });
      setCurrentScreen('SETUP_HUB');
    } catch (error) {
      console.error('Failed to save mess profile:', error);

      setToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save mess profile',
      });
    }
  };

  const handleUploadPhoto = async (photo: File) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await updateMessPhoto(token, photo);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || 'Failed to upload mess photo'
        );
      }
      const photoUrl = response.data?.photoUrl;
      setMessData((prev) =>
        prev
          ? {
            ...prev,
            photoUrl
          }
          : prev
      );

      setToast({
        type: 'success',
        message: 'Mess photo uploaded successfully',
      });
    } catch (error) {
      console.error('Failed to upload mess photo:', error);

      setToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to upload mess photo',
      });
    }
  };

  // const handlePublishSuccess = () => {
  //   setMessData((prev) =>
  //     prev
  //       ? {
  //         ...prev,
  //         isPublished: true,
  //         status: 'LIVE',
  //       }
  //       : prev
  //   );

  //   setShowPublishSuccess(true);
  // };
  const handlePublishSuccess = () => {
    setMessData((prev) =>
      prev
        ? {
          ...prev,
          listingStatus: 'LIVE',
        }
        : prev
    );

    setCurrentScreen('OPERATIONAL_HOME');
  };

  const handleFinishPublishSuccess = () => {
    setShowPublishSuccess(false);
    setCurrentScreen('OPERATIONAL_HOME');
  };

  if (loading) {
    return (
      <div className="min-h-dvh w-full">
        {/* Replace with your reusable LoadingState */}
        <div className="flex min-h-dvh items-center justify-center">
          <p>Loading your mess setup...</p>
        </div>
      </div>
    );
  }

  if (error || !messData) {
    return (
      <div className="min-h-dvh w-full">
        {/* Replace with your reusable ErrorState */}
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <p>
            {error || 'Unable to load your mess setup.'}
          </p>

          <button
            type="button"
            onClick={loadMessPartnerSetup}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full">
      {toast && (
        <div className="fixed top-4 right-4 z-[100]">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={3000}
          />
        </div>
      )}
      {currentScreen === 'SETUP_HUB' && (
        <SetupHub
          messData={messData}
          hasPlans={hasPlans}
          onOpenProfile={() =>
            setCurrentScreen('MESS_PROFILE')
          }
          onOpenPreview={() =>
            setCurrentScreen('STUDENT_PREVIEW')
          }
          onOpenMessPlans={() =>
            setCurrentScreen(
              hasPlans
                ? 'MESS_PLAN_OVERVIEW'
                : 'CREATE_MESS_PLAN'
            )
          }
          initialTab={initialTab}
        />
      )}
      {/* 
      {currentScreen === 'MONTHLY_PRICE' && (
        <MonthlyPriceScreen
          initialPrice={messData.monthlyPrice}
          onSave={handleSaveMonthlyPrice}
          onBack={() =>
            setCurrentScreen('SETUP_HUB')
          }
        />
      )} */}
      {currentScreen === 'MESS_PLANS' && (
        <MessPlans
          plans={plans}
          onAddPlan={() => {
            setPlanReturnTo('listing');
            setCurrentScreen('CREATE_MESS_PLAN');
          }}
          onBack={() => {
            setCurrentScreen('SETUP_HUB');

            if (planReturnTo === 'listing') {
              setInitialTab('listing');
            }
          }}
        />
      )}

      {/* {currentScreen === 'CREATE_MESS_PLAN' && (
        <MessPlanScreen
          onSave={handleCreateMessPlan}
          onBack={() => setCurrentScreen('SETUP_HUB')}
        />
      )} */}
      {currentScreen === 'CREATE_MESS_PLAN' && (
        <MessPlanScreen
          onSave={handleCreateMessPlan}
          onBack={() => {
            if (planReturnTo === 'listing') {
              setCurrentScreen('OPERATIONAL_HOME');
              setInitialTab('listing');
            } else {
              setCurrentScreen('SETUP_HUB');
            }
          }}
        />
      )}
      {currentScreen === 'MESS_PLAN_OVERVIEW' && (
        <MessPlansOverview
          plans={plans}
          onAddPlan={() =>
            setCurrentScreen('CREATE_MESS_PLAN')
          }
          onBack={() =>
            setCurrentScreen('SETUP_HUB')
          }
        />
      )}

      {currentScreen === 'MESS_PROFILE' && (
        <MessProfileForm
          initialData={messData}
          onSave={handleSaveProfile}
          onUploadPhoto={handleUploadPhoto}
          onBack={() =>
            setCurrentScreen('SETUP_HUB')
          }
        />
      )}

      {currentScreen === 'STUDENT_PREVIEW' && (
        <StudentPreview
          messData={messData}
          onEdit={() =>
            setCurrentScreen('MESS_PROFILE')
          }
          onPublishSuccess={handlePublishSuccess}
          onBack={() =>
            setCurrentScreen('SETUP_HUB')
          }
        />
      )}

      {currentScreen === 'OPERATIONAL_HOME' && (
        <OperationalHome
          messData={messData}
          initialTab={initialTab}
          onEditProfile={() =>
            setCurrentScreen('MESS_PROFILE')
          }
          onPreviewStudentView={() =>
            setCurrentScreen('STUDENT_PREVIEW')
          }
          toast={toast}
          onToastClose={() => setToast(null)}
        />
      )}

      {showPublishSuccess && (
        <PublishSuccess
          onContinue={handleFinishPublishSuccess}
        />
      )}
    </div>
  );
}