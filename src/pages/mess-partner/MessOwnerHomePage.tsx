// import { useState, useEffect } from 'react';
// import type {
//   AppScreen,
//   FoodType,
//   MealType,
//   MessOwnerData,
// } from '../../types/messOnboarding';
// import { INITIAL_MESS_DATA } from '../../mockData';
// import { SetupHub } from '../../components/mess-partner/setup/SetupHub';
// import { MonthlyPriceScreen } from '../../components/mess-partner/profile/MonthlyPriceScreen';
// import { MessProfileForm } from '../../components/mess-partner/profile/MessProfileForm';
// import { StudentPreview } from '../../components/mess-partner/preview/StudentPreview';
// import { PublishSuccess } from '../../components/mess-partner/publish/PublishSuccess';
// import { OperationalHome } from '../../components/mess-partner/home/OperationalHome';

// const STORAGE_KEY = 'fleximeal_mess_owner_state_v1';

// export default function MessOwnerHomePage() {
//   // Local storage loaded state (falls back cleanly to INITIAL_MESS_DATA)
//   const [messData, setMessData] = useState<MessOwnerData>(() => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       if (saved) {
//         return JSON.parse(saved);
//       }
//     } catch {
//       // ignore storage errors
//     }
//     return INITIAL_MESS_DATA;
//   });

//   const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
//     // If mess is already published, enter Operational Kitchen Home immediately!
//     return messData.isPublished ? 'OPERATIONAL_HOME' : 'SETUP_HUB';
//   });

//   const [showPublishSuccess, setShowPublishSuccess] = useState(false);

//   // Persist updates to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messData));
//     } catch {
//       // ignore storage error
//     }
//   }, [messData]);

//   // Handler: Save Monthly Price
//   const handleSaveMonthlyPrice = (price: number) => {
//     setMessData((prev) => ({
//       ...prev,
//       monthlyPrice: price,
//     }));
//     // Return to Setup Hub
//     setCurrentScreen('SETUP_HUB');
//   };

//   // Handler: Save Mess Profile
//   const handleSaveProfile = (profileData: {
//     description: string;
//     mealAvailability: MealType[];
//     foodType: FoodType;
//     photos: string[];
//   }) => {
//     setMessData((prev) => ({
//       ...prev,
//       description: profileData.description,
//       mealAvailability: profileData.mealAvailability,
//       foodType: profileData.foodType,
//       photos: profileData.photos,
//     }));
//     // Return to Setup Hub
//     setCurrentScreen('SETUP_HUB');
//   };

//   // Handler: Publish Completed
//   const handlePublishSuccess = () => {
//     setMessData((prev) => ({
//       ...prev,
//       isPublished: true,
//       status: 'LIVE',
//     }));
//     setShowPublishSuccess(true);
//   };

//   const handleFinishPublishSuccess = () => {
//     setShowPublishSuccess(false);
//     setCurrentScreen('OPERATIONAL_HOME');
//   };

//   return (
//     <div className="min-h-dvh w-full">
//       {/* SCREEN ROUTING */}
//       {currentScreen === 'SETUP_HUB' && (
//         <SetupHub
//           messData={messData}
//           onOpenMonthlyPrice={() => setCurrentScreen('MONTHLY_PRICE')}
//           onOpenProfile={() => setCurrentScreen('MESS_PROFILE')}
//           onOpenPreview={() => setCurrentScreen('STUDENT_PREVIEW')}
//         />
//       )}

//       {currentScreen === 'MONTHLY_PRICE' && (
//         <MonthlyPriceScreen
//           initialPrice={messData.monthlyPrice}
//           onSave={handleSaveMonthlyPrice}
//           onBack={() => setCurrentScreen('SETUP_HUB')}
//         />
//       )}

//       {currentScreen === 'MESS_PROFILE' && (
//         <MessProfileForm
//           initialData={messData}
//           onSave={handleSaveProfile}
//           onBack={() => setCurrentScreen('SETUP_HUB')}
//         />
//       )}

//       {currentScreen === 'STUDENT_PREVIEW' && (
//         <StudentPreview
//           messData={messData}
//           onEdit={() => setCurrentScreen('MESS_PROFILE')}
//           onPublishSuccess={handlePublishSuccess}
//           onBack={() => setCurrentScreen('SETUP_HUB')}
//         />
//       )}

//       {currentScreen === 'OPERATIONAL_HOME' && (
//         <OperationalHome
//           messData={messData}
//           onEditProfile={() => setCurrentScreen('MESS_PROFILE')}
//           onPreviewStudentView={() => setCurrentScreen('STUDENT_PREVIEW')}
//         />
//       )}

//       {/* PUBLISH SUCCESS TRANSITION MODAL */}
//       {showPublishSuccess && (
//         <PublishSuccess onContinue={handleFinishPublishSuccess} />
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import Toast from '../../components/ui-elements/Toast';

import type {
  AppScreen,
  FoodType,
  MealType,
  MessOwnerData,
} from '../../types/messOnboarding';

import { getMessPartnerSetup, updateMessProfile, updateMonthlyPrice, updateMessPhoto } from '../../apis/mess-partner/MessPartnerSetup.api';

import { SetupHub } from '../../components/mess-partner/setup/SetupHub';
import { MonthlyPriceScreen } from '../../components/mess-partner/profile/MonthlyPriceScreen';
import { MessProfileForm } from '../../components/mess-partner/profile/MessProfileForm';
import { StudentPreview } from '../../components/mess-partner/preview/StudentPreview';
import { PublishSuccess } from '../../components/mess-partner/publish/PublishSuccess';
import { OperationalHome } from '../../components/mess-partner/home/OperationalHome';
import type { ToastType } from '../../types/ui-elements/toast';

export default function MessOwnerHomePage() {
  const { getToken } = useAuth();

  const [messData, setMessData] = useState<MessOwnerData | null>(null);
  const [currentScreen, setCurrentScreen] =
    useState<AppScreen>('SETUP_HUB');

  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const loadMessPartnerSetup = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await getMessPartnerSetup(token);

      const { user, mess } = response.data;

      /*
       * Convert backend response into the existing
       * MessOwnerData shape used by the UI components.
       */
      const normalizedData: MessOwnerData = {
        // Existing onboarding information
        name: mess.name,
        address: mess.address,
        city: mess.city,
        state: mess.state,

        // Setup information
        monthlyPrice: mess.monthlyPrice,
        description: mess.description ?? '',
        foodType: (mess.foodType ?? '') as FoodType,

        // mealAvailability: [
        //   ...(mess.offersBreakfast ? ['BREAKFAST'] : []),
        //   ...(mess.offersLunch ? ['LUNCH'] : []),
        //   ...(mess.offersDinner ? ['DINNER'] : []),
        // ] as MealType[],
        // foodType: mess.foodType ?? null,

        offersBreakfast: mess.offersBreakfast,
        offersLunch: mess.offersLunch,
        offersDinner: mess.offersDinner,

        listingStatus: mess.listingStatus,
        publishedAt: mess.publishedAt,

        // // Photos are not stored in the current DB schema yet
        // photos: []
        profileId: mess.profileId,
        userId: user.userId,


        // IMPORTANT: backend values
        photoUrl: mess.photoUrl,
        profileCompleted: mess.profileCompleted,
      };

      console.log('MESS SETUP FROM API:', {
        profileCompleted: mess.profileCompleted,
        photoUrl: mess.photoUrl,
        description: mess.description,
        foodType: mess.foodType,
        offersBreakfast: mess.offersBreakfast,
        offersLunch: mess.offersLunch,
        offersDinner: mess.offersDinner,
      });

      setMessData(normalizedData);
      console.log('NORMALIZED MESS DATA:', normalizedData);

      setCurrentScreen(
        mess.listingStatus === 'LIVE'
          ? 'OPERATIONAL_HOME'
          : 'SETUP_HUB'
      );
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

  const handleSaveMonthlyPrice = async (price: number) => {
    if (!messData) return;

    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await updateMonthlyPrice(token, price);

      if (!response.success) {
        throw new Error(
          response.message || 'Failed to update monthly price'
        );
      }

      setMessData((prev) =>
        prev
          ? {
            ...prev,
            monthlyPrice: price,
          }
          : prev
      );

      setCurrentScreen('SETUP_HUB');
    } catch (error) {
      console.error('Failed to save monthly price:', error);
    }
  };

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

  const handlePublishSuccess = () => {
    setMessData((prev) =>
      prev
        ? {
          ...prev,
          isPublished: true,
          status: 'LIVE',
        }
        : prev
    );

    setShowPublishSuccess(true);
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
          onOpenMonthlyPrice={() =>
            setCurrentScreen('MONTHLY_PRICE')
          }
          onOpenProfile={() =>
            setCurrentScreen('MESS_PROFILE')
          }
          onOpenPreview={() =>
            setCurrentScreen('STUDENT_PREVIEW')
          }
        />
      )}

      {currentScreen === 'MONTHLY_PRICE' && (
        <MonthlyPriceScreen
          initialPrice={messData.monthlyPrice}
          onSave={handleSaveMonthlyPrice}
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
          onEditProfile={() =>
            setCurrentScreen('MESS_PROFILE')
          }
          onPreviewStudentView={() =>
            setCurrentScreen('STUDENT_PREVIEW')
          }
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