// import React, { useState } from 'react';
// import type { PublishedMess } from '../../types/user';

// interface MessCardProps {
//   mess: PublishedMess;
//   onSelect: (messId: string) => void;
//   onPaygClick?: (messId: string) => void;
// }

// export const MessCard: React.FC<MessCardProps> = ({ mess, onSelect, onPaygClick }) => {
//   const [imgError, setImgError] = useState(false);

//   // Available meals summary
//   const availableMealsList = (['breakfast', 'lunch', 'dinner'] as const)
//     .filter((m) => mess.meals[m].available)
//     .map((m) => m.charAt(0).toUpperCase() + m.slice(1));

//   // Minimum monthly price
//   const activePrices = (['breakfast', 'lunch', 'dinner'] as const)
//     .filter((m) => mess.meals[m].available)
//     .map((m) => mess.meals[m].monthlyPrice);
//   const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 0;

//   return (
//     <div
//       onClick={() => onSelect(mess.id)}
//       className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
//     >
//       {/* Top Image Container */}
//       <div className="relative h-44 w-full bg-[#F3F4F6] overflow-hidden">
//         {!imgError ? (
//           <img
//             src={mess.image}
//             alt={mess.name}
//             referrerPolicy="no-referrer"
//             onError={() => setImgError(true)}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8EE] to-[#FFEDD5] text-[#9A3412] p-4 text-center">
//             <i className="fa-solid fa-utensils text-2xl mb-1"></i>
//             <span className="font-heading font-semibold text-sm">{mess.name}</span>
//           </div>
//         )}

//         {/* Gradient Scrim for contrast */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

//         {/* Top Badges */}
//         <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
//           {mess.isLive && (
//             <span className="bg-[#16A34A] text-white text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
//               <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
//               LIVE
//             </span>
//           )}
//           <span
//             className={`text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm ${
//               mess.foodType === 'Pure Veg'
//                 ? 'bg-[#15803D] text-white'
//                 : 'bg-[#991B1B] text-white'
//             }`}
//           >
//             {mess.foodType}
//           </span>
//         </div>

//         {/* Top Right Rating */}
//         <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
//           <i className="fa-solid fa-star text-[#FBBF24] text-[10px]"></i>
//           <span>{mess.rating}</span>
//           <span className="text-[10px] text-[#9CA3AF]">({mess.reviewCount})</span>
//         </div>

//         {/* Bottom image overlay: Distance & Address */}
//         <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
//           <span className="truncate max-w-[200px] text-white/90">
//             <i className="fa-solid fa-location-dot text-[11px] mr-1 text-[#FBBF24]"></i>
//             {mess.address.split(',')[0]}
//           </span>
//           <span className="font-semibold shrink-0 bg-black/50 px-1.5 py-0.5 rounded text-[11px]">
//             {mess.distanceKm} km
//           </span>
//         </div>
//       </div>

//       {/* Card Content Body */}
//       <div className="p-3.5">
//         <div className="flex items-start justify-between gap-2 mb-1">
//           <h3 className="font-heading font-bold text-base text-[#111827] leading-tight">
//             {mess.name}
//           </h3>
//           <div className="text-right shrink-0">
//             <span className="text-[11px] text-[#6B7280] block">Starts at</span>
//             <span className="font-heading font-bold text-sm text-[#111827]">
//               ₹{minPrice.toLocaleString()}<span className="text-[10px] font-normal text-[#6B7280]">/mo</span>
//             </span>
//           </div>
//         </div>

//         {/* Tagline / Speciality */}
//         <p className="text-xs text-[#6B7280] line-clamp-1 mb-2.5">
//           {mess.speciality || mess.tagline}
//         </p>

//         {/* Meal Availability Line (Clean unboxed metadata) */}
//         <div className="flex items-center gap-1.5 text-xs text-[#4B5563] pb-3 border-b border-[#F3F4F6]">
//           <i className="fa-regular fa-clock text-[11px] text-[#9CA3AF]"></i>
//           <span>Serves:</span>
//           <span className="font-medium text-[#111827]">
//             {availableMealsList.join(' · ')}
//           </span>
//         </div>

//         {/* Action Buttons */}
//         <div className="pt-2.5 flex items-center justify-between gap-2">
//           {onPaygClick && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onPaygClick(mess.id);
//               }}
//               className="text-xs font-semibold text-[#FF6B00] hover:text-[#EA580C] px-2 py-1.5 rounded-lg active:bg-[#FFF7ED] transition-colors"
//             >
//               PAYG Meal ₹{mess.meals.lunch.paygPrice}
//             </button>
//           )}

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onSelect(mess.id);
//             }}
//             className="ml-auto min-h-[38px] px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
//           >
//             <span>View Mess</span>
//             <i className="fa-solid fa-chevron-right text-[10px]"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import type { PublishedMess } from '../../types/user';
import { getMediaUrl } from '../../utils/media';
interface MessCardProps {
  mess: PublishedMess;
  onSelect: (messId: string) => void;
  onPaygClick?: (messId: string) => void;
}

export const MessCard: React.FC<MessCardProps> = ({
  mess,
  onSelect,
  onPaygClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const availableMealsList = [
    mess.offers_breakfast && 'Breakfast',
    mess.offers_lunch && 'Lunch',
    mess.offers_dinner && 'Dinner',
  ].filter(Boolean) as string[];

  const monthlyPrice = Number(mess.monthly_price);

  console.log('Mess photo URL:', mess.photo_url);

  const primaryPhoto = getMediaUrl(mess.photo_url);

  return (
    <div
      onClick={() => onSelect(String(mess.profile_id))}
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44 w-full bg-[#F3F4F6] overflow-hidden">
        {!imgError && mess.photo_url ? (
          <img
            src={primaryPhoto}
            alt={mess.mess_name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8EE] to-[#FFEDD5] text-[#9A3412] p-4 text-center">
            <i className="fa-solid fa-utensils text-2xl mb-1"></i>

            <span className="font-heading font-semibold text-sm">
              {mess.mess_name}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

        {/* Food Type */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm ${mess.food_type === 'VEG'
                ? 'bg-[#15803D] text-white'
                : 'bg-[#991B1B] text-white'
              }`}
          >
            {mess.food_type === 'VEG_NON_VEG'
              ? 'Veg & Non-Veg'
              : mess.food_type}
          </span>
        </div>

        {/* Location */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs">
          <span className="truncate block text-white/90">
            <i className="fa-solid fa-location-dot text-[11px] mr-1 text-[#FBBF24]"></i>
            {mess.mess_city}, {mess.mess_state}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-bold text-base text-[#111827] leading-tight">
            {mess.mess_name}
          </h3>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-[#6B7280] block">
              Monthly
            </span>

            <span className="font-heading font-bold text-sm text-[#111827]">
              ₹{monthlyPrice.toLocaleString('en-IN')}
              <span className="text-[10px] font-normal text-[#6B7280]">
                /mo
              </span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7280] line-clamp-1 mb-2.5">
          {mess.description || 'Quality meals for your everyday needs.'}
        </p>

        {/* Meal Availability */}
        <div className="flex items-center gap-1.5 text-xs text-[#4B5563] pb-3 border-b border-[#F3F4F6]">
          <i className="fa-regular fa-clock text-[11px] text-[#9CA3AF]"></i>

          <span>Serves:</span>

          <span className="font-medium text-[#111827]">
            {availableMealsList.length > 0
              ? availableMealsList.join(' · ')
              : 'No meals specified'}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2.5 flex items-center justify-between gap-2">
          {onPaygClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPaygClick(String(mess.profile_id));
              }}
              className="text-xs font-semibold text-[#FF6B00] hover:text-[#EA580C] px-2 py-1.5 rounded-lg active:bg-[#FFF7ED] transition-colors"
            >
              PAYG Meal
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(String(mess.profile_id));
            }}
            className="ml-auto min-h-[38px] px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <span>View Mess</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};