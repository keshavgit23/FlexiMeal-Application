import React from 'react';
import type { MealType } from '../../../types/messOnboarding';

export interface MealAvailabilityProps {
  selectedMeals: MealType[];
  onChange: (meals: MealType[]) => void;
}

const MEAL_OPTIONS: { id: MealType; label: string; time: string; icon: string }[] = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    time: '7:30 AM – 10:00 AM',
    icon: 'fa-solid fa-mug-hot',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    time: '12:00 PM – 3:00 PM',
    icon: 'fa-solid fa-sun',
  },
  {
    id: 'dinner',
    label: 'Dinner',
    time: '7:30 PM – 10:30 PM',
    icon: 'fa-solid fa-moon',
  },
];

export const MealAvailability: React.FC<MealAvailabilityProps> = ({
  selectedMeals,
  onChange,
}) => {
  const toggleMeal = (id: MealType) => {
    if (selectedMeals.includes(id)) {
      if (selectedMeals.length > 1) {
        onChange(selectedMeals.filter((m) => m !== id));
      }
    } else {
      onChange([...selectedMeals, id]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading">
          Daily Meals Provided <span className="text-red-500">*</span>
        </label>
        <span className="text-[11px] text-gray-400">At least 1 required</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {MEAL_OPTIONS.map((opt) => {
          const isSelected = selectedMeals.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleMeal(opt.id)}
              className={`min-h-[50px] p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className={opt.icon} />
                </div>
                <div>
                  <div className="text-sm font-bold font-heading">{opt.label}</div>
                  <div className="text-[11px] text-gray-500">{opt.time}</div>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs transition ${
                  isSelected
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <i className="fa-solid fa-check text-[10px]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
