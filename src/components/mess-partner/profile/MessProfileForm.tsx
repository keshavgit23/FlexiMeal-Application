import React, { useState } from 'react';
import type { FoodType, MealType, MessOwnerData } from '../../../types/messOnboarding';
import { SAMPLE_DEFAULT_DESCRIPTION } from '../../../mockData';
import { MealAvailability } from './MealAvailability';
import { FoodTypeSelector } from './FoodTypeSelector';
import { PhotoSection } from './PhotoSection';
import { InlineError } from '../shared/StateView';
import { StickyActionBar } from '../shared/StickyActionBar';

export interface MessProfileFormProps {
  initialData: MessOwnerData;
  onSave: (data: {
    description: string;
    mealAvailability: MealType[];
    foodType: FoodType;
    photo: File | null;
  }) => Promise<void>;
  onBack: () => void;
  onUploadPhoto: (photo: File) => Promise<void>;
}

export const MessProfileForm: React.FC<MessProfileFormProps> = ({
  initialData,
  onUploadPhoto,
  onSave,
  onBack,
}) => {
  const [description, setDescription] = useState<string>(
    initialData.description || SAMPLE_DEFAULT_DESCRIPTION
  );
  const [mealAvailability, setMealAvailability] = useState<MealType[]>([
    ...(initialData.offersBreakfast ? ['breakfast' as const] : []),
    ...(initialData.offersLunch ? ['lunch' as const] : []),
    ...(initialData.offersDinner ? ['dinner' as const] : []),
  ]);
  const [foodType, setFoodType] = useState<FoodType>(
    initialData.foodType || 'PURE_VEG'
  );
  const [photo, setPhoto] = useState<File | null>(null);

  const [descError, setDescError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // const [isProfileCompleted, setIsProfileCompleted] = useState(
  //   initialData.profileCompleted
  // );
  const isProfileCompleted = initialData.profileCompleted;

  const hasPhoto = Boolean(initialData.photoUrl);
  const isFullyCompleted = isProfileCompleted && hasPhoto;

  const validate = (): boolean => {
    if (!description.trim()) {
      setDescError('Please provide a brief description for students.');
      return false;
    }
    if (description.trim().length < 15) {
      setDescError('Description should be at least 15 characters long.');
      return false;
    }
    if (mealAvailability.length === 0) {
      setDescError('Please select at least one daily meal.');
      return false;
    }
    setDescError('');
    return true;
  };

  // const handleSave = () => {
  //   if (validate()) {
  //     onSave({
  //       description: description.trim(),
  //       mealAvailability,
  //       foodType,
  //       photo,
  //     });
  //   }
  // };
  const handleSave = async () => {
    if (!validate() || isSaving || isProfileCompleted) return;

    try {
      setIsSaving(true);

      await onSave({
        description: description.trim(),
        mealAvailability,
        foodType,
        photo,
      });

    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async (photo: File) => {
    await onUploadPhoto(photo);
  };
  console.log('PROFILE INITIAL DATA:', initialData);
  console.log('PROFILE COMPLETED:', initialData.profileCompleted);
  console.log('PHOTO URL:', initialData.photoUrl);
  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3.5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Setup Hub"
          className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition"
        >
          <i className="fa-solid fa-arrow-left text-base" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 font-heading">
            Mess Profile &amp; Meals
          </h1>
          <p className="text-[11px] text-gray-500 truncate">
            Public student listing information
          </p>
        </div>
      </header>

      {/* FORM BODY */}
      <main className="flex-1 p-4 space-y-6 pb-8 max-w-md mx-auto w-full">
        {/* Helper Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
          <i className="fa-solid fa-circle-info text-emerald-700 text-sm mt-0.5 shrink-0" />
          <span>
            This information will be displayed directly on your student-facing
            listing. Keep it clear and accurate.
          </span>
        </div>
        {!isProfileCompleted && (
          <>
            {/* 1. Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="mess-description"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading"
                >
                  Public Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {description.length}/250
                </span>
              </div>
              <textarea
                id="mess-description"
                rows={3}
                maxLength={250}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (descError) setDescError('');
                }}
                placeholder="e.g. Hygienic home-style food served fresh near MIT College. Unlimited chapati & daily dal."
                className="w-full p-3 text-sm text-gray-900 bg-stone-50 border border-gray-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none transition leading-relaxed resize-none"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Highlight nearby landmarks, unlimited rotis, or cleanliness</span>
                <button
                  type="button"
                  onClick={() => setDescription(SAMPLE_DEFAULT_DESCRIPTION)}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Use suggestion
                </button>
              </div>
              {descError && <InlineError message={descError} />}
            </div>

            {/* 2. Food / Dietary Type */}
            <FoodTypeSelector selectedType={foodType} onChange={setFoodType} />

            {/* 3. Meal Availability */}
            <MealAvailability
              selectedMeals={mealAvailability}
              onChange={setMealAvailability}
            />

            {/* 4. Photos (Optional) */}
            {/* <PhotoSection photos={photos} onChange={setPhotos} /> */}
            <PhotoSection
              photo={photo}
              existingPhotoUrl={initialData.photoUrl}
              onChange={setPhoto}
            />
          </>
        )}

        {isProfileCompleted && !hasPhoto && (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-circle-check text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-900 font-heading">
                    Profile completed
                  </h2>

                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Your mess profile information has been saved successfully.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-emerald-200 pt-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Description
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {initialData.description}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Food Type
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {initialData.foodType}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Meals Available
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {[
                      initialData.offersBreakfast && 'Breakfast',
                      initialData.offersLunch && 'Lunch',
                      initialData.offersDinner && 'Dinner',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <PhotoSection
              photo={photo}
              existingPhotoUrl={initialData.photoUrl}
              onChange={(file) => {
                console.log('PHOTO SELECTED IN FORM:', file);

                if (!file) {
                  setPhoto(null);
                  return;
                }

                setPhoto(file);
                onUploadPhoto(file);
              }}
            />
          </>
        )}
        {/* CASE 3 */}
        {isFullyCompleted && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <i className="fa-solid fa-circle-check text-emerald-700 text-xl" />
              </div>

              <h2 className="mt-4 text-base font-bold text-gray-900 font-heading">
                Your profile is set
              </h2>

              <p className="mt-1 text-xs text-gray-600 leading-relaxed max-w-xs">
                Your mess profile and photo are ready. You can continue with the
                remaining setup steps.
              </p>
            </div>
          </div>
        )}
      </main>

      {!isProfileCompleted && (
        <>
          {/* STICKY BOTTOM ACTION */}
          <StickyActionBar>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full min-h-[50px] px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm font-heading shadow-md transition flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </StickyActionBar>
        </>
      )}
    </div >
  );
};
