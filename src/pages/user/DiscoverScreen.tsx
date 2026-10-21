import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MessCard } from '../../components/user/MessCard';
import { EmptyState } from '../../components/user/EmptyState';
import type {MealType } from '../../types/user';

export const DiscoverScreen: React.FC = () => {
  const {
    publishedMesses,
    setSelectedMessId,
    setIsPaygModalOpen,
    setSelectedPaygMessId,
    emptyDiscoverFilter,
    setEmptyDiscoverFilter,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState<
    'All' | string
  >('All');
  const [selectedMealType, setSelectedMealType] = useState<'All' | MealType>('All');
  const [maxDistance, setMaxDistance] = useState<number>(5);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFoodType('All');
    setSelectedMealType('All');
    setMaxDistance(5);
    setEmptyDiscoverFilter(false);
  };

  const filteredMesses = useMemo(() => {
    if (emptyDiscoverFilter) {
      return [];
    }

    return publishedMesses.filter((m) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.mess_name.toLowerCase().includes(query);
        const matchesAddress = m.mess_address.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress) return false;
      }

      // Food type filter
      if (selectedFoodType !== 'All' && m.food_type !== selectedFoodType) {
        return false;
      }

      // Meal filter
      if (selectedMealType !== 'All') {
        const mealAvailable =
          selectedMealType === 'BREAKFAST'
            ? m.offers_breakfast
            : selectedMealType === 'LUNCH'
              ? m.offers_lunch
              : m.offers_dinner;

        if (!mealAvailable) {
          return false;
        }
      }

      return true;
    });
  }, [publishedMesses, searchQuery, selectedFoodType, selectedMealType, maxDistance, emptyDiscoverFilter]);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Title & Question */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
          Local Mess Discovery
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
          placeholder="Search messes by name, street, or dish..."
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
          {(['All', 'Veg', 'NON_VEG', 'VEG_NON_VEG'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => {
                setSelectedFoodType(ft);
                if (emptyDiscoverFilter) setEmptyDiscoverFilter(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 whitespace-nowrap active:scale-95 ${selectedFoodType === ft
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
            >
              {ft}
            </button>
          ))}
        </div>

        {/* Meal Type filter row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-[#6B7280] mr-1 shrink-0">
            Meal:
          </span>
          {(['All', 'BREAKFAST', 'LUNCH', 'DINNER'] as const).map((mt) => (
            <button
              key={mt}
              onClick={() => {
                setSelectedMealType(mt);
                if (emptyDiscoverFilter) setEmptyDiscoverFilter(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 whitespace-nowrap capitalize active:scale-95 ${selectedMealType === mt
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
            >
              {mt}
            </button>
          ))}
        </div>
      </div>

      {/* Mess Cards or Empty State */}
      {filteredMesses.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-store-slash"
          title="No messes found"
          description="We couldn't find any mess matching your current search or diet criteria."
          suggestions={[
            'Changing the food type filter',
            'Searching another street or area name',
            'Selecting "All" meals to view wider availability',
          ]}
          actionLabel="Clear Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Showing {filteredMesses.length} messes nearby</span>
            <span>Live today</span>
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
