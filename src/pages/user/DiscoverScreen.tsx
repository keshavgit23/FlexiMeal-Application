import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MessCard } from '../../components/user/MessCard';
import { EmptyState } from '../../components/user/EmptyState';
import type { MealType } from '../../types/user';

export const DiscoverScreen: React.FC = () => {
  const {
    publishedMesses,
    isPublishedMessesLoading,
    publishedMessesError,
    refreshPublishedMesses,
    setSelectedMessId,
    setIsPaygModalOpen,
    setSelectedPaygMessId,
    emptyDiscoverFilter,
    setEmptyDiscoverFilter,
  } = useApp();

  type FoodFilter = 'All' | 'PURE_VEG' | 'NON_VEG' | 'VEG_NON_VEG';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState<FoodFilter>('All');
  const [selectedMealType, setSelectedMealType] = useState<'All' | MealType>('All');

  const mealFilters: { label: string; value: 'All' | MealType }[] = [
    { label: 'All', value: 'All' },
    { label: 'Breakfast', value: 'BREAKFAST' },
    { label: 'Lunch', value: 'LUNCH' },
    { label: 'Dinner', value: 'DINNER' },
  ];
  const foodFilters: { label: string; value: FoodFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'Pure Veg', value: 'PURE_VEG' },
    { label: 'Veg & Non-Veg', value: 'VEG_NON_VEG' },
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFoodType('All');
    setSelectedMealType('All');
    setEmptyDiscoverFilter(false);
  };

  const mealFilters = [
  { label: "All", value: "All" },
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
] as const;
  const filteredMesses = useMemo(() => {
    if (emptyDiscoverFilter) return [];

    const query = searchQuery.trim().toLowerCase();

    return publishedMesses.filter((m) => {
      // Search by mess name and address
      if (query) {
        const name = (m.mess_name ?? '').toLowerCase();
        const address = (m.mess_address ?? '').toLowerCase();

        if (!name.includes(query) && !address.includes(query)) {
          return false;
        }
      }

      // Food type filter
      if (
        selectedFoodType !== 'All' &&
        m.food_type !== selectedFoodType
      ) {
        return false;
      }

      // Meal availability filter
      if (selectedMealType !== 'All') {
        const mealAvailable = {
          BREAKFAST: m.offers_breakfast,
          LUNCH: m.offers_lunch,
          DINNER: m.offers_dinner,
        }[selectedMealType];

        if (!mealAvailable) return false;
      }

      return true;
    });
  }, [
    publishedMesses,
    searchQuery,
    selectedFoodType,
    selectedMealType,
    emptyDiscoverFilter,
  ]);
  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Title & Question */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
          Mess Discovery
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-[#111827] leading-tight">
          Where should I eat?
        </h1>
        <p className="text-xs text-[#6B7280]">
          Clean homestyle bhojanalayas with monthly subscriptions & PAYG
        </p>
      </div>

      {/* Search Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (emptyDiscoverFilter) setEmptyDiscoverFilter(false);
          }}
          placeholder="Search messes by name..."
          className="w-full min-h-[46px] pl-9 pr-8 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#DC2626] shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#111827]"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        )}
      </div>

      {/* Compact Filters (Functional Button Controls with zero-pill metadata discipline) */}
      <div className="space-y-2">
        {/* Food Type filter row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-[#6B7280] mr-1 shrink-0">
            Diet:
          </span>
          {foodFilters.map((ft) => (
            <button
              key={ft.value}
              onClick={() => {
                setSelectedFoodType(ft.value);
                if (emptyDiscoverFilter) setEmptyDiscoverFilter(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 whitespace-nowrap active:scale-95 ${selectedFoodType === ft.value
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Meal Type filter row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-[#6B7280] mr-1 shrink-0">
            Meal:
          </span>
          {mealFilters.map((mt) => (
            <button
              key={mt.value}
              onClick={() => {
                setSelectedMealType(mt.value);
                if (emptyDiscoverFilter) setEmptyDiscoverFilter(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 whitespace-nowrap capitalize active:scale-95 ${selectedMealType === mt.value
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>


      {isPublishedMessesLoading && publishedMesses.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 animate-pulse space-y-3"
            >
              <div className="h-4 w-2/3 bg-[#E5E7EB] rounded" />
              <div className="h-3 w-1/2 bg-[#E5E7EB] rounded" />
              <div className="h-3 w-full bg-[#E5E7EB] rounded" />
              <div className="h-9 w-1/3 bg-[#E5E7EB] rounded-lg" />
            </div>
          ))}
        </div>
      ) : publishedMessesError && publishedMesses.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center space-y-3">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-[#DC2626]" />

          <h3 className="font-bold text-sm text-[#111827]">
            Couldn't load messes
          </h3>

          <p className="text-xs text-[#6B7280]">
            {publishedMessesError}
          </p>

          <button
            onClick={() => void refreshPublishedMesses()}
            className="px-4 py-2 rounded-lg bg-[#DC2626] text-white text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : filteredMesses.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-store-slash"
          title="No messes found"
          description="We couldn't find any mess matching your current search or diet criteria."
          suggestions={[
            'Changing the food type filter',
            'Searching another street or area name',
            'Selecting "All" meals to view wider availability"',
          ]}
          actionLabel="Clear Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div className="space-y-4">
          {isPublishedMessesLoading && (
            <p className="text-xs text-[#6B7280] flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin" />
              Refreshing messes...
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Showing {filteredMesses.length}</span>
            <span>Live Listings</span>
          </div>

          {filteredMesses.map((mess) => (
            <MessCard
              key={mess.profile_id}
              mess={mess}
              onSelect={(id) => setSelectedMessId(id)}
              onPaygClick={(id) => {
                setSelectedPaygMessId(id);
                setIsPaygModalOpen(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
