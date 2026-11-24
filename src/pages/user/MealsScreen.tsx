import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealConfirmation } from '../../components/user/MealConfirmation';
import { EmptyState } from '../../components/user/EmptyState';
import { ErrorState } from '../../components/user/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatMealDate, getIndiaDateString } from '../../utils/dateTime';

export const MealsScreen: React.FC = () => {
  const {
    meals,
    activeSubscriptions,
    updateMealStatus,
    respondToMeal,
    refreshLiveMeals,
    liveMealsError,
    mealHistory,
    mealHistoryLoading,
    mealHistoryError,
    mealHistoryHasMore,
    refreshMealHistory,
    setActiveTab,
  } = useApp();
  const [subTab, setSubTab] = useState<'today' | 'upcoming' | 'history'>('today');
  const [submittingMealId, setSubmittingMealId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    void refreshLiveMeals();
    void refreshMealHistory(0);
  }, [refreshLiveMeals, refreshMealHistory]);

  const today = getIndiaDateString();
  const todayMeals = meals.filter(
    (meal) =>
      (meal.endAt ? meal.date === today : meal.displayDate === 'Today')
  );
  const upcomingMeals = meals.filter(
    (meal) =>
      (meal.endAt
        ? meal.date > today
        : meal.displayDate !== 'Today' && meal.displayDate !== 'Yesterday')
  );

  const handleMealResponse = async (
    mealId: string,
    confirmationId: number | undefined,
    responseOpen: boolean | undefined,
    mealStatus: 'UPCOMING' | 'ACTIVE' | undefined,
    isPayg: boolean | undefined,
    newStatus: 'explicit_yes' | 'explicit_no'
  ) => {
    if (!confirmationId && !mealStatus) {
      updateMealStatus(mealId, newStatus);
      return;
    }

    if (!confirmationId || !responseOpen || isPayg) {
      return;
    }

    setSubmittingMealId(mealId);
    try {
      await respondToMeal(
        confirmationId,
        newStatus === 'explicit_yes' ? 'YES' : 'NO'
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save your response',
        'error'
      );
    } finally {
      setSubmittingMealId(null);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
          Daily Meal Participation
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-[#111827]">
          Am I eating today?
        </h1>
        <p className="text-xs text-[#6B7280]">
          Confirm or skip meals before the cutoff to help messes cook accurately.
        </p>
      </div>

      {liveMealsError && (
        <ErrorState
          title="Unable to refresh meals"
          message={liveMealsError}
          onRetry={() => void refreshLiveMeals()}
        />
      )}

      {/* Segmented Control Sub-Tabs (Interactive button tabs) */}
      <div className="grid grid-cols-3 p-1 bg-[#F3F4F6] rounded-xl">
        <button
          onClick={() => setSubTab('today')}
          className={`min-h-[38px] text-xs font-bold rounded-lg transition-all ${
            subTab === 'today'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          Today ({todayMeals.length})
        </button>
        <button
          onClick={() => setSubTab('upcoming')}
          className={`min-h-[38px] text-xs font-bold rounded-lg transition-all ${
            subTab === 'upcoming'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          Upcoming ({upcomingMeals.length})
        </button>
        <button
          onClick={() => setSubTab('history')}
          className={`min-h-[38px] text-xs font-bold rounded-lg transition-all ${
            subTab === 'history'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          History
        </button>
      </div>

      {/* TODAY SUB-TAB */}
      {subTab === 'today' && (
        <div className="space-y-3">
          {todayMeals.length === 0 ? (
            <EmptyState
              icon="fa-solid fa-utensils"
              title="No meals scheduled for today"
              description="You do not have any active meal subscription for today."
              actionLabel="Explore Mess Plans"
              onAction={() => setActiveTab('discover')}
            />
          ) : (
            todayMeals.map((meal) => {
              const sub = activeSubscriptions.find((s) => s.meal_type === meal.mealType);
              return (
                <MealConfirmation
                  key={meal.id}
                  meal={meal}
                  subscription={sub}
                  isSubmitting={submittingMealId === meal.id}
                  onConfirm={(newStatus) => {
                    if (newStatus === 'explicit_yes' || newStatus === 'explicit_no') {
                      void handleMealResponse(
                        meal.id,
                        meal.confirmationId,
                        meal.responseOpen,
                        meal.mealStatus,
                        meal.isPayg,
                        newStatus
                      );
                    }
                  }}
                />
              );
            })
          )}
        </div>
      )}

      {/* UPCOMING SUB-TAB */}
      {subTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingMeals.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 text-center text-xs text-[#6B7280] flex flex-col items-center gap-3 text-center">
              <i className="fa-regular fa-calendar text-xl text-[#9CA3AF] mb-2 block"></i>
              No future meals scheduled yet.
            </div>
          ) : (
            upcomingMeals.map((meal) => {
              const sub = activeSubscriptions.find((s) => s.meal_type === meal.mealType);
              return (
                <MealConfirmation
                  key={meal.id}
                  meal={meal}
                  subscription={sub}
                  showCompact={false}
                  isSubmitting={submittingMealId === meal.id}
                  onConfirm={(newStatus) => {
                    if (newStatus === 'explicit_yes' || newStatus === 'explicit_no') {
                      void handleMealResponse(
                        meal.id,
                        meal.confirmationId,
                        meal.responseOpen,
                        meal.mealStatus,
                        meal.isPayg,
                        newStatus
                      );
                    }
                  }}
                />
              );
            })
          )}
        </div>
      )}

      {/* HISTORY SUB-TAB */}
      {subTab === 'history' && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold text-[#6B7280] px-1">
            Recent meal attendance & confirmations
          </div>

          {mealHistoryError && (
            <ErrorState
              title="Unable to load meal history"
              message={mealHistoryError}
              onRetry={() => void refreshMealHistory(0)}
            />
          )}

          <div className="space-y-2">
            {mealHistory.map((meal) => {
              const responseLabel =
                meal.confirmation_status === 'YES'
                  ? 'Confirmed Yes'
                  : meal.confirmation_status === 'NO'
                    ? 'Confirmed No'
                    : 'No response recorded';
              const bookingLabel =
                meal.booking_status?.replace('_', ' ') || 'Booked';
              const priceLabel =
                meal.payg_price == null
                  ? null
                  : `₹${Number(meal.payg_price).toLocaleString('en-IN')}`;

              return (
              <div
                key={meal.meal_id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-heading font-bold text-xs text-[#111827]">
                      {formatMealDate(meal.meal_date)} · {meal.meal_type}
                    </span>
                    {meal.is_payg && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#FF6B00] border border-[#FFEDD5]">
                        PAYG
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#4B5563]">
                    {meal.mess_name}
                  </div>
                </div>

                <div className="text-right">
                  {meal.is_payg ? (
                    <>
                      <span className="text-xs font-semibold text-[#16A34A]">
                        {bookingLabel}
                      </span>
                      {priceLabel && (
                        <span className="block text-[10px] text-[#6B7280]">
                          {priceLabel}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className={`text-xs font-semibold ${
                        meal.confirmation_status === 'YES'
                          ? 'text-[#16A34A]'
                          : meal.confirmation_status === 'NO'
                            ? 'text-[#DC2626]'
                            : 'text-[#6B7280]'
                      }`}>
                        {responseLabel}
                      </span>
                      {meal.default_response && (
                        <span className="block text-[10px] text-[#6B7280]">
                          Subscription preference: Default {meal.default_response}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {mealHistoryLoading && (
            <div className="text-center text-xs text-[#6B7280] py-2">
              Loading meal history…
            </div>
          )}

          {!mealHistoryLoading && mealHistory.length === 0 && !mealHistoryError && (
            <EmptyState
              icon="fa-solid fa-clock-rotate-left"
              title="No meal history yet"
              description="Meals will appear here after they have ended."
            />
          )}

          {mealHistoryHasMore && !mealHistoryLoading && (
            <button
              type="button"
              onClick={() => void refreshMealHistory(mealHistory.length)}
              className="w-full min-h-[40px] text-xs font-semibold text-[#DC2626] hover:underline"
            >
              Load older meals
            </button>
          )}
        </div>
      )}
    </div>
  );
};
