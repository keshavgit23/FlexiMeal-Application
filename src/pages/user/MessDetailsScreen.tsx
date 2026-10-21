import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionModal } from '../../components/user/SubscriptionModal';
import type { MealType, SubscriptionPreference } from '../../types/user';
import { getMediaUrl } from '../../utils/media';

interface MessDetailsScreenProps {
  messId: string;
}

export const MessDetailsScreen: React.FC<MessDetailsScreenProps> = ({ messId }) => {
  const {
    publishedMesses,
    setSelectedMessId,
    createSubscription,
    setIsPaygModalOpen,
    setSelectedPaygMessId,
  } = useApp();

  console.log('messId received:', messId);
  console.log('messes:', publishedMesses);
  console.log('mess IDs:', publishedMesses.map((m) => m.profile_id));
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const primaryPhoto = getMediaUrl(publishedMesses[0]?.photo_url);

  const mess = publishedMesses.find(
    (m) => String(m.profile_id) === String(messId)
  );
  if (!mess) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-[#6B7280]">Mess details not found.</p>
        <button
          onClick={() => setSelectedMessId(null)}
          className="mt-2 text-xs font-bold text-[#DC2626]"
        >
          Return to Messes
        </button>
      </div>
    );
  }

  const mealTypes = ([
    mess.offers_breakfast && 'BREAKFAST',
    mess.offers_lunch && 'LUNCH',
    mess.offers_dinner && 'DINNER',
  ].filter(Boolean)) as MealType[];

  const handleSubscriptionConfirm = (
    mId: string,
    mealType: MealType,
    defaultPref: SubscriptionPreference
  ) => {
    setIsSubscribing(false);
    createSubscription(mId, mealType, defaultPref);
  };

  return (
    <div className="pb-32">
      {/* Top Photo & Header Area */}
      <div className="relative h-60 w-full bg-[#F3F4F6] overflow-hidden">
        {!imgError ? (
          <img
            src={primaryPhoto}
            alt={mess.mess_name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8EE] to-[#FFEDD5] text-[#9A3412]">
            <i className="fa-solid fa-utensils text-3xl mb-1"></i>
            <span className="font-heading font-bold text-base">{mess.mess_name}</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>

        {/* Floating Back Button */}
        <button
          onClick={() => setSelectedMessId(null)}
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#111827] shadow-md active:scale-95 transition-transform"
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>

        {/* Live status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {mess.listing_status === 'LIVE' && (
            <span className="bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm ${mess.food_type === 'PURE_VEG'
              ? 'bg-[#15803D] text-white'
              : 'bg-[#991B1B] text-white'
              }`}
          >
            {mess.food_type === 'PURE_VEG'
              ? 'Pure Veg'
              : mess.food_type === 'VEG_NON_VEG'
                ? 'Veg & Non-Veg'
                : mess.food_type}
          </span>
        </div>

        {/* Title over image bottom */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          {/* <div className="flex items-center gap-2 mb-1">
            <div className="bg-black/60 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              <i className="fa-solid fa-star text-[#FBBF24] text-[10px]"></i>
              <span>{mess.rating}</span>
              <span className="text-[10px] text-gray-300">({mess.reviewCount})</span>
            </div>
            <span className="text-xs text-white/90 font-medium">
              <i className="fa-solid fa-location-dot mr-1 text-[#FBBF24]"></i>
              {mess.distanceKm} km away
            </span>
          </div> */}
          <h1 className="font-heading font-extrabold text-2xl leading-tight">
            {mess.mess_name}
          </h1>
          <p className="text-xs text-white/80 truncate">
            {mess.mess_address}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-5">
        {/* About Section */}
        <div>
          <h2 className="font-heading font-bold text-sm text-[#111827] mb-1.5 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-info text-xs text-[#DC2626]"></i>
            <span>About this Mess</span>
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {mess.description}
          </p>
          {/* <div className="mt-2 text-xs font-medium text-[#7C2D12] bg-[#FFF8EE] p-2.5 rounded-xl border border-[#FFEDD5]">
            <i className="fa-solid fa-award mr-1.5 text-[#FF6B00]"></i>
            {mess.speciality}
          </div> */}
        </div>

        {/* Meals offered & Pricing (Breakfast, Lunch, Dinner) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-sm text-[#111827]">
              Meal Plans & Timings
            </h2>
            <span className="text-[10px] text-[#6B7280]">
              Subscribe individually
            </span>
          </div>

          <div className="space-y-2.5">
            {mealTypes.map((mType) => {
              return (
                <div
                  key={mType}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-xs"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-[#111827] capitalize">
                          {mType}
                        </span>

                        <span className="text-[10px] text-[#16A34A] font-medium">
                          Available
                        </span>
                      </div>

                      <span className="text-xs text-[#6B7280]">
                        {mType === 'BREAKFAST' && 'Breakfast available'}
                        {mType === 'LUNCH' && 'Lunch available'}
                        {mType === 'DINNER' && 'Dinner available'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading font-bold text-sm text-[#111827]">
                        ₹{Number(mess.monthly_price).toLocaleString()}
                      </span>

                      <span className="text-[10px] text-[#6B7280] block">
                        / month
                      </span>
                    </div>
                  </div>

                  {/* Today's menu */}
                  <div className="bg-[#F9FAFB] rounded-lg p-2 border border-[#F3F4F6] text-xs">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-0.5">
                      Today's {mType} Menu:
                    </span>

                    <p className="text-[#374151]">
                      Fresh seasonal menu announced daily morning
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Section */}
        {/* <div>
          <h2 className="font-heading font-bold text-sm text-[#111827] mb-2 flex items-center justify-between">
            <span>Verified Eater Reviews</span>
            <span className="text-xs text-[#6B7280] font-normal">
              ⭐ {mess.rating} ({mess.reviewCount})
            </span>
          </h2>

          <div className="space-y-2">
            {mess.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-xs text-[#111827]">
                      {rev.userName}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">· {rev.mealPlan}</span>
                  </div>
                  <div className="flex items-center text-[10px] text-[#FBBF24]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-[#9CA3AF] block mt-1">
                  {rev.date}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Sticky Bottom Action Bar (Section 15 & 24) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E5E7EB] max-w-[430px] mx-auto p-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div className="flex items-center gap-2">
          {/* Quick PAYG Button */}
          <button
            onClick={() => {
              setSelectedPaygMessId(String(mess.profile_id));
              setIsPaygModalOpen(true);
            }}
            className="min-h-[46px] px-3.5 rounded-xl border border-[#D1D5DB] bg-white text-xs font-bold text-[#FF6B00] hover:bg-[#FFF7ED] active:scale-95 transition-transform"
          >
            PAYG
          </button>

          {/* Primary CTA: Choose a Meal Plan */}
          <button
            onClick={() => setIsSubscribing(true)}
            className="flex-1 min-h-[46px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
          >
            <i className="fa-solid fa-calendar-plus text-xs"></i>
            <span>Choose a Meal Plan</span>
          </button>
        </div>
      </div>

      {/* Subscription Modal Flow */}
      {isSubscribing && (
        <SubscriptionModal
          mess={mess}
          onClose={() => setIsSubscribing(false)}
          onConfirm={handleSubscriptionConfirm}
        />
      )}
    </div>
  );
};
