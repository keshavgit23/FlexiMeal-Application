import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealConfirmation } from '../../components/user/MealConfirmation';
import { EmptyState } from '../../components/user/EmptyState';

export const MealsScreen: React.FC = () => {
  const { meals, activeSubscriptions, updateMealStatus, setActiveTab } = useApp();
  const [subTab, setSubTab] = useState<'today' | 'upcoming' | 'history'>('today');

  const todayMeals = meals.filter((m) => m.displayDate === 'Today');
  const upcomingMeals = meals.filter(
    (m) => m.displayDate !== 'Today' && m.displayDate !== 'Yesterday'
  );
  const historyMeals = meals.filter((m) => m.displayDate === 'Yesterday');

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
                  onConfirm={(newStatus) => updateMealStatus(meal.id, newStatus)}
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
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 text-center text-xs text-[#6B7280]">
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
                  onConfirm={(newStatus) => updateMealStatus(meal.id, newStatus)}
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

          {/* Preset past logs */}
          <div className="space-y-2">
            {historyMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-heading font-bold text-xs text-[#111827]">
                      {meal.displayDate} · {meal.mealType.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">({meal.date})</span>
                  </div>
                  <div className="text-xs text-[#4B5563]">
                    {meal.messName}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1 justify-end">
                    <i className="fa-solid fa-circle-check text-[11px]"></i> Ate (YES)
                  </span>
                  <span className="text-[10px] text-[#6B7280]">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
