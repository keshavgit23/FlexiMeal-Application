import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SegmentedSelect from '../../components/mess-partner/home/meals/SegmentedSelect';
import type { SegmentedOption } from '../../components/mess-partner/home/meals/SegmentedSelect';
import DateInput from '../../components/mess-partner/home/meals/DateInput';
import TimeInput from '../../components/mess-partner/home/meals/TimeInput';
import Toggle from '../../components/mess-partner/home/meals/Toggle';
import MenuItemInput from '../../components/mess-partner/home/meals/MenuItemInput';
import Button from '../../components/mess-partner/home/meals/Button';
import FormField from '../../components/mess-partner/home/meals/FormField';
import { validateMealForm } from '../../utils/mealsValidation';
import { createMeal } from '../../apis/mess-partner/createMeal.api';
import Toast from '../../components/ui-elements/Toast';
import type { ToastType } from '../../types/ui-elements/toast';
import type {
  MealFormData,
  MealFormErrors,
  MealType,
} from '../../utils/mealsValidation';
import { getMealById } from '../../apis/mess-partner/getMealById.api';
import { updateMeal } from '../../apis/mess-partner/updateMealById.api';

export interface MealsProps {
  onBack?: () => void;
  initialDate?: string;
}

const MEAL_TYPE_OPTIONS: SegmentedOption<MealType>[] = [
  { value: 'BREAKFAST', label: 'Breakfast', icon: 'fa-solid fa-mug-saucer' },
  { value: 'LUNCH', label: 'Lunch', icon: 'fa-solid fa-sun' },
  { value: 'DINNER', label: 'Dinner', icon: 'fa-solid fa-moon' },
];

// Helper to get formatted YYYY-MM-DD
function getTodayIsoString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const Meals: React.FC<MealsProps> = ({ initialDate }) => {
  // Form State
  const [formData, setFormData] = useState<MealFormData>({
    mealType: 'LUNCH',
    mealDate: initialDate || getTodayIsoString(),
    startTime: '12:30',
    endTime: '14:30',
    cutoffTime: '11:00',
    payAsYouGo: true,
    menuItems: ['Dal', 'Rice', 'Roti'],
  });

  const { getToken } = useAuth();

  // Errors State
  const [errors, setErrors] = useState<MealFormErrors>({});
  const [showValidationBanner, setShowValidationBanner] = useState<boolean>(false);
  const [clientValidationPassed, setClientValidationPassed] = useState<boolean>(false);
  const [isLoadingMeal, setIsLoadingMeal] = useState(false);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mealId = searchParams.get('mealId');
  const isEditMode = Boolean(mealId);
  // Field change handlers
  const handleMealTypeChange = (mealType: MealType) => {
    setFormData((prev) => ({ ...prev, mealType }));
    if (errors.mealType) {
      setErrors((prev) => ({ ...prev, mealType: undefined }));
    }
  };

  const handleDateChange = (mealDate: string) => {
    setFormData((prev) => ({ ...prev, mealDate }));
    if (errors.mealDate) {
      setErrors((prev) => ({ ...prev, mealDate: undefined }));
    }
  };

  const handleStartTimeChange = (startTime: string) => {
    setFormData((prev) => ({ ...prev, startTime }));
    if (errors.startTime || errors.endTime) {
      setErrors((prev) => ({ ...prev, startTime: undefined, endTime: undefined }));
    }
  };

  const handleEndTimeChange = (endTime: string) => {
    setFormData((prev) => ({ ...prev, endTime }));
    if (errors.endTime) {
      setErrors((prev) => ({ ...prev, endTime: undefined }));
    }
  };

  const handleCutoffTimeChange = (cutoffTime: string) => {
    setFormData((prev) => ({ ...prev, cutoffTime }));
    if (errors.cutoffTime) {
      setErrors((prev) => ({ ...prev, cutoffTime: undefined }));
    }
  };

  const handlePayAsYouGoChange = (payAsYouGo: boolean) => {
    setFormData((prev) => ({ ...prev, payAsYouGo }));
  };

  // Menu items handlers
  const handleMenuItemChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextItems = [...prev.menuItems];
      nextItems[index] = value;
      return { ...prev, menuItems: nextItems };
    });

    if (errors.menuItems || (errors.menuItemErrors && errors.menuItemErrors[index])) {
      setErrors((prev) => {
        const nextItemErrors = { ...prev.menuItemErrors };
        delete nextItemErrors[index];
        return {
          ...prev,
          menuItems: Object.keys(nextItemErrors).length === 0 ? undefined : prev.menuItems,
          menuItemErrors: Object.keys(nextItemErrors).length === 0 ? undefined : nextItemErrors,
        };
      });
    }
  };

  const handleAddMenuItem = (defaultText = '') => {
    setFormData((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, defaultText],
    }));
    if (errors.menuItems) {
      setErrors((prev) => ({ ...prev, menuItems: undefined }));
    }
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData((prev) => {
      const nextItems = prev.menuItems.filter((_, i) => i !== index);
      return { ...prev, menuItems: nextItems };
    });

    if (errors.menuItemErrors) {
      setErrors((prev) => {
        const nextItemErrors = { ...prev.menuItemErrors };
        delete nextItemErrors[index];
        return { ...prev, menuItemErrors: nextItemErrors };
      });
    }
  };

  // Quick suggestion chips for common mess add-ons
  const quickSuggestions = ['Papad', 'Salad', 'Curd', 'Gulab Jamun', 'Pickle'];
  const availableSuggestions = quickSuggestions.filter(
    (sug) => !formData.menuItems.some((item) => item.trim().toLowerCase() === sug.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run client-side validation
    const validationResult = validateMealForm(formData);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setShowValidationBanner(true);
      setClientValidationPassed(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    // Validation succeeded
    setErrors({});
    setShowValidationBanner(false);
    setClientValidationPassed(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const payload = {
        mealType: formData.mealType,
        mealDate: formData.mealDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        cutoffTime: formData.cutoffTime,
        payAsYouGo: formData.payAsYouGo,
        menuItems: formData.menuItems
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEditMode && mealId) {
        // Edit existing meal
        const response = await updateMeal(
          token,
          mealId,
          payload
        );

        console.log('Meal updated successfully:', response);

            console.log('BEFORE NAVIGATE');
        navigate('/mess-owner', {
          state: {
            toast: {
              type: 'success',
              message: 'Meal updated successfully',
            },
          },
        });
      } else {
        // Create new meal
        const response = await createMeal(
          token,
          payload
        );

        console.log('Meal created successfully:', response);

        setToast({
          type: 'success',
          message: 'Meal created successfully',
        });
      }

      // TODO: Navigate back to operational home
    } catch (error) {
      console.error(
        isEditMode
          ? 'Failed to update meal:'
          : 'Failed to create meal:',
        error
      );

      setClientValidationPassed(false);

      setToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : isEditMode
              ? 'Failed to update meal'
              : 'Failed to create meal',
      });
    }
  };

  useEffect(() => {
    if (!isEditMode || !mealId) {
      return;
    }

    const fetchMeal = async () => {
      try {
        setIsLoadingMeal(true);
        const token = await getToken();

        if (!token) {
          throw new Error('Authentication token not available');
        }

        const response = await getMealById(token, mealId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || 'Failed to get meal'
          );
        }

        const meal = response.data;

        setFormData({
          mealType: meal.mealType,
          mealDate: meal.mealDate.slice(0, 10),
          startTime: meal.startTime.slice(0, 5),
          endTime: meal.endTime.slice(0, 5),
          cutoffTime: meal.cutoffTime.slice(0, 5),
          payAsYouGo: meal.payAsYouGo,
          menuItems: meal.menuItems.map(
            (item) => item.itemName
          ),
        });
      } catch (error) {
        console.error(
          'Failed to fetch meal:',
          error
        );

        setToast({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to load meal',
        });
      } finally {
        setIsLoadingMeal(false);
      }
    };

    fetchMeal();
  }, [isEditMode, mealId, getToken]);
  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-24 text-gray-900 flex justify-center">
      <div className="w-full max-w-md px-4 sm:px-6">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-[#FFFDF9]/90 backdrop-blur-md py-3.5 border-b border-gray-200/80 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/mess-owner')}
              aria-label="Back"
              className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer select-none"
            >
              <i className="fa-solid fa-arrow-left text-base" aria-hidden="true" />
            </button>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Add Meal</h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Operational
          </span>
        </header>

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm">
            <Toast
              type={toast.type}
              message={toast.message}
              duration={3000}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        {/* Screen Header Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-heading">
            Add Today&apos;s Meal
          </h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Set up the meal service for your students.
          </p>
        </div>

        {/* Validation Error Banner */}
        {showValidationBanner && Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
          >
            <i className="fa-solid fa-triangle-exclamation text-red-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-xs text-red-800">
              <p className="font-semibold text-red-900">Please review the form</p>
              <p className="mt-0.5 text-red-700">
                Fix the highlighted issues below before submitting the meal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowValidationBanner(false)}
              className="text-red-400 hover:text-red-700 p-1"
              aria-label="Dismiss banner"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        )}

        {/* Validation Success Feedback Banner (Client-side validation only) */}
        {clientValidationPassed && (
          <div
            role="status"
            className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-fadeIn"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fa-solid fa-check text-xs" aria-hidden="true" />
            </div>
            <div className="flex-1 text-xs text-emerald-900">
              <p className="font-bold text-sm text-emerald-950">Client-Side Validation Passed</p>
              <p className="mt-1 leading-relaxed text-emerald-800">
                The form is completely valid and ready for the backend integration.
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-emerald-900 bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200">
                // TODO: Connect POST /operational/meals API
              </p>
            </div>
          </div>
        )}


        {isEditMode && isLoadingMeal ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm font-semibold text-gray-500">
              Loading meal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Card 1: Meal Type & Date */}
            <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              {/* Meal Type */}
              <SegmentedSelect<MealType>
                label="Meal Type"
                options={MEAL_TYPE_OPTIONS}
                value={formData.mealType}
                onChange={handleMealTypeChange}
                error={errors.mealType}
                required
              />

              {/* Meal Date */}
              <DateInput
                label="Meal Date"
                value={formData.mealDate}
                onChange={handleDateChange}
                error={errors.mealDate}
                required
                helperText="Date this meal will be served"
              />
            </section>

            {/* Card 2: Meal Timing & Booking Cutoff */}
            <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <FormField
                label="Meal Timing"
                error={errors.endTime || errors.startTime}
                required
                helperText="Dining hall service operating hours"
              >
                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                  <TimeInput
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                    error={errors.startTime ? '' : undefined} // Error shown at group level
                    placeholder="Start"
                  />

                  <div className="flex items-center justify-center text-gray-400 px-1">
                    <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                  </div>

                  <TimeInput
                    value={formData.endTime}
                    onChange={handleEndTimeChange}
                    error={errors.endTime ? '' : undefined} // Error shown at group level
                    placeholder="End"
                  />
                </div>
              </FormField>

              {/* Booking Cutoff */}
              <TimeInput
                label="Booking Cutoff"
                value={formData.cutoffTime}
                onChange={handleCutoffTimeChange}
                error={errors.cutoffTime}
                required
                helperText="Students must book before this cutoff time"
              />
            </section>

            {/* Card 3: Pay-As-You-Go Policy */}
            <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <Toggle
                label="Pay-As-You-Go"
                description="Allow individual meal bookings"
                icon="fa-solid fa-receipt"
                checked={formData.payAsYouGo}
                onChange={handlePayAsYouGoChange}
              />
            </section>

            {/* Card 4: Today's Menu */}
            <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Today&apos;s Menu <span className="text-red-500 font-bold">*</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Items served during this meal service
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums">
                  {formData.menuItems.length} {formData.menuItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Overall Menu Items Error */}
              {errors.menuItems && (
                <div
                  role="alert"
                  className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200"
                >
                  <i className="fa-solid fa-circle-exclamation text-xs shrink-0" aria-hidden="true" />
                  <span>{errors.menuItems}</span>
                </div>
              )}

              {/* Menu Items List */}
              <div className="space-y-2">
                {formData.menuItems.map((item, index) => (
                  <MenuItemInput
                    key={index}
                    index={index}
                    value={item}
                    onChange={(val) => handleMenuItemChange(index, val)}
                    onRemove={() => handleRemoveMenuItem(index)}
                    error={errors.menuItemErrors?.[index]}
                    onEnterPress={() => handleAddMenuItem('')}
                  />
                ))}

                {formData.menuItems.length === 0 && (
                  <div className="text-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <i className="fa-solid fa-bowl-food text-2xl text-gray-300 mb-1" aria-hidden="true" />
                    <p className="text-xs font-medium text-gray-600">No dishes added yet</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Add at least one item like Dal, Rice, or Roti
                    </p>
                  </div>
                )}
              </div>

              {/* + Add menu item action */}
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={() => handleAddMenuItem('')}
                leftIcon={<i className="fa-solid fa-plus text-xs" aria-hidden="true" />}
                className="mt-2 text-xs border-dashed border-emerald-400/80 text-emerald-800 hover:bg-emerald-50/70"
              >
                Add menu item
              </Button>

              {/* Quick Suggestion Chips */}
              {availableSuggestions.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-medium text-gray-400 block mb-1.5">
                    Quick add common items:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddMenuItem(sug)}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 text-gray-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
                      >
                        <span>+</span>
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Create Meal Action */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<i className="fa-solid fa-check text-sm" aria-hidden="true" />}
                className="shadow-md shadow-emerald-900/10 font-bold"
              >
                Create Meal
              </Button>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Validates inputs before sending to the operational backend
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Meals;
