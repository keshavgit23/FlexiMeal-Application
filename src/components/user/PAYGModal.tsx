import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MealType, PaygMeal } from '../../types/user';
import { useToast } from '../../context/ToastContext';
import {
  formatMealDate,
} from '../../utils/dateTime';

interface PAYGModalProps {
  initialMessId?: string | null;
  onClose: () => void;
}

interface PaygMess {
  id: string;
  profileId: number;
  name: string;
  address: string;
  foodType: string;
  meals: PaygMeal[];
}

const mealLabels: Record<MealType, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
};

export const PAYGModal: React.FC<PAYGModalProps> = ({
  initialMessId,
  onClose,
}) => {
  const {
    selectedPaygMessId,
    paygMeals,
    isPaygMealsLoading,
    paygMealsError,
    fetchPaygMeals,
    bookPaygMeal,
    setIsPaygModalOpen,
    setShowPaygBookingHook
  } = useApp();
  const { showToast } = useToast();

  const [selectedMessId, setSelectedMessId] = useState('');
  const [selectedMealType, setSelectedMealType] =
    useState<MealType>('LUNCH');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    void fetchPaygMeals();
  }, [fetchPaygMeals]);

  const filteredPaygMeals = useMemo(() => {
    // No specific mess selected: show all PAYG meals.
    if (!selectedPaygMessId) {
      return paygMeals;
    }

    // A specific mess was selected: show only its meals.
    return paygMeals.filter(
      (meal) => meal.profile_id === Number(selectedPaygMessId)
    );
  }, [paygMeals, selectedPaygMessId]);

  const messes = useMemo<PaygMess[]>(() => {
    const grouped = new Map<number, PaygMess>();

    for (const meal of filteredPaygMeals) {
      let mess = grouped.get(meal.profile_id);

      if (!mess) {
        mess = {
          id: String(meal.profile_id),
          profileId: meal.profile_id,
          name: meal.mess_name,
          address: [
            meal.mess_address,
            meal.mess_city,
            meal.mess_state,
          ]
            .filter(Boolean)
            .join(', '),
          foodType: meal.food_type,
          meals: [],
        };

        grouped.set(meal.profile_id, mess);
      }

      mess.meals.push(meal);
    }
    return Array.from(grouped.values());
  }, [filteredPaygMeals]);

  // Select the requested mess when available; otherwise use the first one.
  useEffect(() => {
    if (messes.length === 0) return;

    const requestedMess = messes.find(
      (mess) => mess.id === String(initialMessId ?? '')
    );

    setSelectedMessId((currentId) => {
      const currentMessExists = messes.some(
        (mess) => mess.id === currentId
      );

      if (currentMessExists) return currentId;

      return requestedMess?.id ?? messes[0].id;
    });
  }, [messes, initialMessId]);

  const selectedMess = messes.find(
    (mess) => mess.id === selectedMessId
  );

  const availableMeals = selectedMess?.meals ?? [];

  const selectedMeal =
    availableMeals.find(
      (meal) => meal.meal_type === selectedMealType
    ) ?? availableMeals[0];

  // Keep the selected meal type valid when changing messes.
  useEffect(() => {
    if (
      availableMeals.length > 0 &&
      !availableMeals.some(
        (meal) => meal.meal_type === selectedMealType
      )
    ) {
      setSelectedMealType(availableMeals[0].meal_type);
    }
  }, [selectedMessId, paygMeals]);

  const handleBookMeal = async () => {
    if (!selectedMeal || isBooking) return;

    setIsBooking(true);
    try {
      const booking = await bookPaygMeal(selectedMeal);

      showToast(
        `${mealLabels[selectedMeal.meal_type]} booked successfully!`,
        'success'
      );
      setShowPaygBookingHook(true);
      setIsPaygModalOpen(false);

      console.log('PAYG booking:', booking);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to book meal. Please try again.',
        'error'
      );
    } finally {
      setIsBooking(false);
    }
  };
  const handleMealSelection = (mealType: MealType) => {
    setSelectedMealType(mealType);
  };
  const renderMealContent = () => {
    if (isPaygMealsLoading && paygMeals.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-[#6B7280]">
          Loading available meals...
        </p>
      );
    }

    if (paygMealsError && paygMeals.length === 0) {
      return (
        <div className="space-y-3 py-6 text-center">
          <p className="text-sm text-red-600">{paygMealsError}</p>
          <button
            type="button"
            onClick={() => void fetchPaygMeals()}
            className="rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (messes.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-[#6B7280]">
          No PAYG meals are currently available.
        </p>
      );
    }

    return (
      <div className="space-y-3.5">
        <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-xl p-3 text-xs text-[#9A3412]">
          <strong className="block font-semibold mb-0.5">
            Want a meal somewhere else today?
          </strong>
          <span>
            Purchase an individual meal without changing your regular
            monthly subscription.
          </span>
        </div>

        {/* Select Mess */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#111827] block">
            Select Mess
          </label>

          <div className="space-y-2">
            {messes.map((mess) => {
              const isSelected = selectedMessId === mess.id;
              const lowestPrice = Math.min(
                ...mess.meals.map((meal) => Number(meal.price))
              );

              return (
                <button
                  key={mess.id}
                  type="button"
                  onClick={() => setSelectedMessId(mess.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${isSelected
                    ? 'border-[#FF6B00] bg-[#FFF7ED]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
                    }`}
                >
                  <div className="min-w-0">
                    <span className="font-heading font-bold text-xs text-[#111827] block">
                      {mess.name}
                    </span>
                    <span className="text-[11px] text-[#6B7280] block">
                      {mess.foodType}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] block truncate">
                      {mess.address}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-[#FF6B00]">
                    From ₹{lowestPrice.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedMess && (
          <>
            {/* Select an actually available meal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111827] block">
                Available Meals
              </label>

              <div className="grid grid-cols-3 gap-2">
                {selectedMess.meals.map((meal) => (
                  <button
                    key={meal.meal_id}
                    type="button"
                    onClick={() =>
                      handleMealSelection(meal.meal_type)
                    }
                    className={`min-h-[48px] rounded-xl border text-xs font-bold transition-all ${selectedMeal?.meal_id === meal.meal_id
                      ? 'border-[#DC2626] bg-[#FFF8EE] text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white text-[#4B5563]'
                      }`}
                  >
                    {mealLabels[meal.meal_type]}
                    <span className="block mt-1">
                      ₹{Number(meal.price).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Details for the selected meal */}
            {selectedMeal && (
              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB] text-xs">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1">
                  {mealLabels[selectedMeal.meal_type]} Menu
                </span>

                <p className="text-[#374151]">
                  {selectedMeal.menu_items.length > 0
                    ? selectedMeal.menu_items.join(' • ')
                    : 'Menu not added yet'}
                </p>

                <span className="text-[10px] text-[#6B7280] block mt-2">
                  Date: {formatMealDate(selectedMeal.meal_date)}
                </span>

                <span className="text-[10px] text-[#6B7280] block mt-1">
                  Timing: {formatTime(selectedMeal.start_time)} –{' '}
                  {formatTime(selectedMeal.end_time)}
                </span>

                <span className="text-[10px] text-[#6B7280] block mt-1">
                  Booking cutoff: {formatTime(selectedMeal.cutoff_time)}
                </span>

                <span className="text-[10px] text-[#6B7280] block mt-1">
                  Status: {selectedMeal.status}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleBookMeal()}
              disabled={!selectedMeal || isBooking}
              className="w-full min-h-[48px] bg-[#FF6B00] text-white text-xs font-bold rounded-xl disabled:bg-[#D1D5DB] disabled:text-[#4B5563]"
            >
              {isBooking
                ? 'Booking...'
                : `Book Meal · ₹${Number(selectedMeal?.price ?? 0).toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
      <div
        className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        }}
      >
        <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <div>
            <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wide">
              Pay As You Go (Single Meal)
            </span>
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              Get a Single Meal
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-base" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3.5 flex-1 pr-1">
          {renderMealContent()}
        </div>
      </div>
    </div>
  );
};
