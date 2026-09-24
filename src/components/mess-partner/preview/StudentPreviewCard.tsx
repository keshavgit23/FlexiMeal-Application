import React from 'react';
import type { MessOwnerData } from '../../../types/messOnboarding';
import {getMediaUrl} from '../../../utils/media';
export interface StudentPreviewCardProps {
    messData: MessOwnerData;
}

export const StudentPreviewCard: React.FC<StudentPreviewCardProps> = ({
    messData,
}) => {
   const primaryPhoto = getMediaUrl(messData.photoUrl);
   console.log('PHOTO PATH:', messData.photoUrl);
console.log('RESOLVED PHOTO URL:', primaryPhoto);
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition">
            {/* Cover / Photo Area */}
            <div className="relative h-48 bg-stone-100 flex items-center justify-center overflow-hidden">
                {primaryPhoto ? (
                    <img
                        src={primaryPhoto}
                        alt={messData.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-500 mb-2">
                            <i className="fa-solid fa-image text-xl" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                            No cover photo added
                        </span>
                    </div>
                )}

                {/* Dietary Badge on Cover */}
                <div className="absolute top-3 left-3">
                    {messData.foodType === 'PURE_VEG' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                            <span className="w-4 h-4 border-2 border-emerald-700 p-0.5 rounded-sm flex items-center justify-center shrink-0">
                                <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                            </span>
                            <span>PURE VEG</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
                            <span className="w-4 h-4 border-2 border-amber-800 p-0.5 rounded-sm flex items-center justify-center shrink-0">
                                <span className="w-1.5 h-1.5 bg-amber-800 rounded-full" />
                            </span>
                            <span>VEG / NON-VEG</span>
                        </span>
                    )}
                </div>

                {/* Verified Mess Pill */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow">
                        <i className="fa-solid fa-check text-[9px]" />
                        <span>FlexiMeal Verified</span>
                    </span>
                </div>

                {/* Price Tag Overlay Bottom */}
                <div className="absolute bottom-3 right-3">
                    <div className="px-3 py-1.5 rounded-xl bg-gray-950/85 backdrop-blur-md text-white shadow-lg border border-white/10 flex items-baseline gap-1">
                        <span className="text-lg font-black font-heading text-emerald-300">
                            ₹{messData.monthlyPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-gray-300 font-medium">/ month</span>
                    </div>
                </div>
            </div>

            {/* Listing Content Details */}
            <div className="p-4 space-y-4">
                {/* Header & Location */}
                <div>
                    <h2 className="text-xl font-black text-gray-900 font-heading leading-snug">
                        {messData.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                        <i className="fa-solid fa-location-dot text-emerald-700 text-xs shrink-0" />
                        <span className="font-medium">
                            {messData.address}, {messData.city}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-gray-100">
                    {messData.description ||
                        'Hygienic home-style food served fresh daily near major colleges.'}
                </p>

                {/* Meal Service Badges */}
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-heading">
                        Meal Shifts Included
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            ...(messData.offersBreakfast
                                ? [{ key: 'breakfast', label: 'breakfast' }]
                                : []),
                            ...(messData.offersLunch
                                ? [{ key: 'lunch', label: 'lunch' }]
                                : []),
                            ...(messData.offersDinner
                                ? [{ key: 'dinner', label: 'dinner' }]
                                : []),
                        ].map((meal) => (
                            <span
                                key={meal.key}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold capitalize"
                            >
                                <i
                                    className={
                                        meal.key === 'breakfast'
                                            ? 'fa-solid fa-mug-hot text-emerald-700 text-[11px]'
                                            : meal.key === 'lunch'
                                                ? 'fa-solid fa-sun text-emerald-700 text-[11px]'
                                                : 'fa-solid fa-moon text-emerald-700 text-[11px]'
                                    }
                                />
                                <span>{meal.label}</span>
                            </span>
                        ))}
                    </div>
                </div>
                {/* Home-style food attributes */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-bowl-food text-emerald-700 text-xs" />
                        <span>Unlimited Chapatis</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-emerald-700 text-xs" />
                        <span>Clean &amp; Sanitized</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
