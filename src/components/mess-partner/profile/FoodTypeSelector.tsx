import React from 'react';
import type { FoodType } from '../../../types/messOnboarding';

export interface FoodTypeSelectorProps {
  selectedType: FoodType;
  onChange: (type: FoodType) => void;
}

export const FoodTypeSelector: React.FC<FoodTypeSelectorProps> = ({
  selectedType,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading block">
        Food / Dietary Category <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {/* Pure Veg */}
        <button
          type="button"
          onClick={() => onChange('PURE_VEG')}
          className={`min-h-[56px] p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
            selectedType === 'PURE_VEG'
              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Veg Badge Symbol */}
          <div className="w-6 h-6 border-2 border-emerald-700 p-0.5 rounded-sm flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 font-heading">
              Pure Veg
            </div>
            <div className="text-[10px] text-gray-500">100% Vegetarian</div>
          </div>
        </button>

        {/* Veg / Non-Veg */}
        <button
          type="button"
          onClick={() => onChange('VEG_NON_VEG')}
          className={`min-h-[56px] p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
            selectedType === 'VEG_NON_VEG'
              ? 'bg-orange-50 border-orange-600 ring-2 ring-orange-600/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Non-Veg Badge Symbol */}
          <div className="w-6 h-6 border-2 border-amber-800 p-0.5 rounded-sm flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 bg-amber-800 rounded-full" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 font-heading">
              Veg &amp; Non-Veg
            </div>
            <div className="text-[10px] text-gray-500">Non-veg on Wed/Sun</div>
          </div>
        </button>
      </div>
    </div>
  );
};
