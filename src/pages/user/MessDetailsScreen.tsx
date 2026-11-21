import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MealType, PublishedMessPlan } from '../../types/user';
import { getMediaUrl } from '../../utils/media';
import { SubscriptionModal } from '../../components/user/SubscriptionModal';

interface MessDetailsScreenProps {
  messId: string;
}

const MEAL_META: Record<
  MealType,
  {
    label: string;
    icon: string;
    badgeClass: string;
    iconBoxClass: string;
    description: string;
  }
> = {
  BREAKFAST: {
    label: 'Breakfast',
    icon: 'fa-solid fa-mug-hot',
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
    iconBoxClass: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]',
    description: 'Daily morning meal included in this plan',
  },
  LUNCH: {
    label: 'Lunch',
    icon: 'fa-solid fa-sun',
    badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
    iconBoxClass: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
    description: 'Daily afternoon meal included in this plan',
  },
  DINNER: {
    label: 'Dinner',
    icon: 'fa-solid fa-moon',
    badgeClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]',
    iconBoxClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
    description: 'Daily evening meal included in this plan',
  },
};

function getMealMeta(mType: MealType | string) {
  const key = String(mType).toUpperCase() as MealType;
  return (
    MEAL_META[key] ?? {
      label: String(mType).replace(/_/g, ' '),
      icon: 'fa-solid fa-bowl-food',
      badgeClass: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
      iconBoxClass: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
      description: 'Included in this monthly meal plan',
    }
  );
}

function getTargetGenderMeta(targetGender?: string | null) {
  switch (targetGender) {
    case 'MALE':
      return {
        label: 'Men Only',
        icon: 'fa-solid fa-mars',
        className: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]',
      };
    case 'FEMALE':
      return {
        label: 'Women Only',
        icon: 'fa-solid fa-venus',
        className: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
      };
    case 'ALL':
      return {
        label: 'All Genders',
        icon: 'fa-solid fa-users',
        className: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
      };
    default:
      return {
        label: targetGender ? targetGender.replace(/_/g, ' ') : 'Open to All',
        icon: 'fa-solid fa-user-group',
        className: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
      };
  }
}

function getFoodTypeMeta(foodType?: string | null) {
  switch (foodType) {
    case 'PURE_VEG':
      return {
        label: 'Pure Veg',
        icon: 'fa-solid fa-leaf',
        className: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
      };
    case 'VEG_NON_VEG':
      return {
        label: 'Veg & Non-Veg',
        icon: 'fa-solid fa-utensils',
        className: 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]',
      };
    default:
      return {
        label: foodType ? foodType.replace(/_/g, ' ') : 'Mess Kitchen',
        icon: 'fa-solid fa-utensils',
        className: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
      };
  }
}

function formatPrice(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

export const MessDetailsScreen: React.FC<MessDetailsScreenProps> = ({ messId }) => {
  const {
    publishedMesses,
    setSelectedMessId,
    setIsPaygModalOpen,
    setSelectedPaygMessId,
    createSubscription,
  } = useApp();

  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<PublishedMessPlan | null>(null);
  const mess = publishedMesses.find(
    (m) => String(m.profile_id) === String(messId)
  );

  const plans = mess?.plans ?? [];
  const selectedPlan =
    selectedPlanId !== null
      ? plans.find((p) => String(p.plan_id) === String(selectedPlanId)) ?? null
      : null;

  useEffect(() => {
    if (!selectedPlan) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPlanId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPlan]);

  if (!mess) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-store-slash text-lg" aria-hidden="true"></i>
          </div>
          <h1 className="font-heading font-bold text-lg text-[#111827]">
            Mess not found
          </h1>
          <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
            This mess may be unavailable right now or the listing was removed.
          </p>
          <button
            type="button"
            onClick={() => setSelectedMessId(null)}
            className="mt-5 w-full min-h-[44px] px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] active:scale-[0.98] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
            <span>Return to Messes</span>
          </button>
        </div>
      </div>
    );
  }

  const primaryPhoto = getMediaUrl(mess.photo_url);
  const showImageFallback = !primaryPhoto || failedPhotoUrl === primaryPhoto;
  const foodMeta = getFoodTypeMeta(mess.food_type);
  const fullLocation = [mess.mess_address, mess.mess_city]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(', ');
  const compactLocation = mess.mess_city?.trim() || mess.mess_address?.trim() || '';

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#111827] pb-28">
      {/* A. Header */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <h2 className="font-heading font-bold text-sm text-[#111827] truncate leading-tight">
              {mess.mess_name}
            </h2>
            {compactLocation && (
              <p className="text-[11px] text-[#6B7280] truncate flex items-center gap-1 mt-0.5">
                <i
                  className="fa-solid fa-location-dot text-[10px] text-[#DC2626] shrink-0"
                  aria-hidden="true"
                ></i>
                <span className="truncate">{compactLocation}</span>
              </p>
            )}
          </div>

          {mess.listing_status === 'LIVE' && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857] text-[10px] font-bold tracking-wide">
              <i className="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>
              <span>LIVE</span>
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        {/* B. Mess Hero Section */}
        <section aria-label="Mess overview" className="space-y-3.5">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] rounded-2xl overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]">
            {!showImageFallback ? (
              <img
                src={primaryPhoto}
                alt={mess.mess_name}
                referrerPolicy="no-referrer"
                onError={() => setFailedPhotoUrl(primaryPhoto)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8EE] to-[#FFEDD5] text-[#9A3412] px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#FFEDD5] flex items-center justify-center mb-2.5 text-[#FF6B00]">
                  <i className="fa-solid fa-utensils text-xl" aria-hidden="true"></i>
                </div>
                <span className="font-heading font-bold text-base text-[#111827]">
                  {mess.mess_name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${foodMeta.className}`}
              >
                <i className={`${foodMeta.icon} text-[10px]`} aria-hidden="true"></i>
                <span>{foodMeta.label}</span>
              </span>

              {mess.mess_city?.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF8EE] border border-[#FFEDD5] text-[#7C2D12] text-[11px] font-semibold">
                  <i className="fa-solid fa-city text-[10px]" aria-hidden="true"></i>
                  <span>{mess.mess_city}</span>
                </span>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-[22px] sm:text-2xl text-[#111827] leading-tight tracking-tight">
              {mess.mess_name}
            </h1>

            {fullLocation && (
              <p className="text-xs sm:text-sm text-[#4B5563] flex items-start gap-2 leading-relaxed">
                <i
                  className="fa-solid fa-location-dot text-xs text-[#DC2626] mt-0.5 shrink-0"
                  aria-hidden="true"
                ></i>
                <span>{fullLocation}</span>
              </p>
            )}
          </div>

          {mess.description?.trim() && (
            <div className="pt-3 border-t border-[#E5E7EB]">
              <h2 className="font-heading font-bold text-xs text-[#6B7280] uppercase tracking-wider mb-1">
                About this Mess
              </h2>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                {mess.description}
              </p>
            </div>
          )}
        </section>

        {/* C. Monthly Meal Plans */}
        <section aria-labelledby="monthly-plans-heading" className="space-y-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2
                id="monthly-plans-heading"
                className="font-heading font-bold text-base sm:text-lg text-[#111827] leading-tight"
              >
                Monthly Meal Plans
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Tap any plan card to inspect full plan details
              </p>
            </div>
            <span className="text-xs font-semibold text-[#047857] tabular-nums shrink-0">
              {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF8EE] border border-[#FFEDD5] text-[#FF6B00] flex items-center justify-center mx-auto mb-3">
                <i className="fa-regular fa-calendar-xmark text-lg" aria-hidden="true"></i>
              </div>
              <h3 className="font-heading font-bold text-sm text-[#111827]">
                No active monthly plans
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto leading-relaxed">
                This mess does not have active monthly plans right now. You can still try a single meal using Pay-As-You-Go below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plans.map((plan) => {
                const genderMeta = getTargetGenderMeta(plan.target_gender);
                const mealTypes = plan.meal_types ?? [];
                const formattedPrice = formatPrice(plan.price);
                const isSelected =
                  selectedPlanId !== null &&
                  String(selectedPlanId) === String(plan.plan_id);

                return (
                  <div
                    key={plan.plan_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlanId(plan.plan_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPlanId(plan.plan_id);
                      }
                    }}
                    className={`group bg-white rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] ${isSelected
                      ? 'border-[#16A34A] ring-1 ring-[#16A34A]/20'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                      }`}
                  >
                    <div>
                      {/* Plan Title & Price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1.5">
                          <h3 className="font-heading font-bold text-[15px] text-[#111827] leading-snug">
                            {plan.plan_name || 'Monthly Plan'}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${genderMeta.className}`}
                          >
                            <i
                              className={`${genderMeta.icon} text-[10px]`}
                              aria-hidden="true"
                            ></i>
                            <span>{genderMeta.label}</span>
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          {formattedPrice ? (
                            <>
                              <span className="font-heading font-extrabold text-xl text-[#111827] tabular-nums block leading-none">
                                {formattedPrice}
                              </span>
                              <span className="text-[11px] font-medium text-[#6B7280] mt-1 block">
                                / month
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-[#6B7280]">
                              Price N/A
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meal Inclusions */}
                      <div className="mt-3.5">
                        {mealTypes.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {mealTypes.map((mType) => {
                              const meta = getMealMeta(mType);
                              return (
                                <span
                                  key={mType}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${meta.badgeClass}`}
                                >
                                  <i
                                    className={`${meta.icon} text-[10px]`}
                                    aria-hidden="true"
                                  ></i>
                                  <span>{meta.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                            <i
                              className="fa-regular fa-clock text-[11px]"
                              aria-hidden="true"
                            ></i>
                            <span>Meal inclusions not specified</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Details Hint & Visual-Only Subscribe CTA */}
                    <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111827] inline-flex items-center gap-1.5 transition-colors">
                        <span>View details</span>
                        <i
                          className="fa-solid fa-chevron-right text-[10px]"
                          aria-hidden="true"
                        ></i>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubscriptionPlan(plan);
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        aria-label={`Subscribe to ${plan.plan_name || 'plan'}`}
                        className="min-h-[40px] px-4 rounded-xl bg-[#16A34A] hover:bg-[#047857] active:scale-[0.98] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shrink-0"
                      >
                        <i className="fa-solid fa-check text-[11px]" aria-hidden="true"></i>
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* F. Sticky Bottom Action Bar (PAYG Secondary Action) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E5E7EB]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 pt-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading font-bold text-xs text-[#111827] truncate">
              Not ready for a monthly plan?
            </p>
            <p className="text-[11px] text-[#6B7280] truncate">
              Book a single meal via Pay-As-You-Go
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedPaygMessId(String(mess.profile_id));
              setIsPaygModalOpen(true);
            }}
            className="min-h-[42px] px-4 rounded-xl border border-[#FF6B00]/40 bg-[#FFF7ED] hover:bg-[#FFEDD5] active:scale-[0.98] text-xs font-bold text-[#C2410C] inline-flex items-center justify-center gap-1.5 shrink-0 transition-all"
          >
            <i className="fa-solid fa-receipt text-xs" aria-hidden="true"></i>
            <span>Try PAYG</span>
          </button>
        </div>
      </div>

      {/* D. Plan Details Drawer */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-drawer-title"
        >
          {/* Dimmed Backdrop */}
          <div
            onClick={() => setSelectedPlanId(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 starting:opacity-0"
            aria-hidden="true"
          />

          {/* Slide-Up Sheet */}
          <div className="relative z-10 w-full max-w-2xl bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl max-h-[85vh] flex flex-col transition-transform duration-200 ease-out translate-y-0 starting:translate-y-full">
            {/* Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <span className="w-10 h-1 rounded-full bg-[#D1D5DB]" aria-hidden="true" />
            </div>

            {/* Drawer Header */}
            <div className="px-5 pt-2 pb-4 border-b border-[#E5E7EB] flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857] block">
                  Plan Details
                </span>
                <h3
                  id="plan-drawer-title"
                  className="font-heading font-extrabold text-lg sm:text-xl text-[#111827] leading-snug"
                >
                  {selectedPlan.plan_name || 'Monthly Plan'}
                </h3>
                <div>
                  {(() => {
                    const genderMeta = getTargetGenderMeta(selectedPlan.target_gender);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${genderMeta.className}`}
                      >
                        <i
                          className={`${genderMeta.icon} text-[10px]`}
                          aria-hidden="true"
                        ></i>
                        <span>{genderMeta.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlanId(null)}
                aria-label="Close plan details"
                className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] flex items-center justify-center shrink-0 transition-colors"
              >
                <i className="fa-solid fa-xmark text-base" aria-hidden="true"></i>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="px-5 py-4 overflow-y-auto space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#6B7280] block">
                    Monthly Price
                  </span>
                  <span className="text-xs text-[#374151] mt-0.5 block">
                    {mess.mess_name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  {formatPrice(selectedPlan.price) ? (
                    <>
                      <span className="font-heading font-extrabold text-2xl text-[#111827] tabular-nums">
                        {formatPrice(selectedPlan.price)}
                      </span>
                      <span className="text-xs text-[#6B7280] font-medium ml-1">
                        / month
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-[#6B7280]">
                      Price unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Included Meals List */}
              <div className="space-y-2.5">
                <h4 className="font-heading font-bold text-sm text-[#111827]">
                  Included Meals ({(selectedPlan.meal_types ?? []).length})
                </h4>

                {(selectedPlan.meal_types ?? []).length > 0 ? (
                  <div className="space-y-2">
                    {(selectedPlan.meal_types ?? []).map((mType) => {
                      const meta = getMealMeta(mType);
                      return (
                        <div
                          key={mType}
                          className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-center gap-3"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${meta.iconBoxClass}`}
                          >
                            <i className={`${meta.icon} text-sm`} aria-hidden="true"></i>
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-sm text-[#111827]">
                              {meta.label}
                            </p>
                            <p className="text-xs text-[#6B7280]">{meta.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 text-xs text-[#6B7280] flex items-center gap-2">
                    <i className="fa-regular fa-clock text-sm" aria-hidden="true"></i>
                    <span>Specific meal types are not listed for this plan.</span>
                  </div>
                )}
              </div>

              {/* Mess Summary */}
              <div className="bg-[#FFF8EE] rounded-2xl border border-[#FFEDD5] p-3.5 space-y-2 text-xs text-[#4B5563]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#6B7280]">Kitchen Type</span>
                  <span className="font-semibold text-[#111827]">{foodMeta.label}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#6B7280]">Eligibility</span>
                  <span className="font-semibold text-[#111827]">
                    {getTargetGenderMeta(selectedPlan.target_gender).label}
                  </span>
                </div>
                {fullLocation && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#6B7280] shrink-0">Location</span>
                    <span className="font-medium text-[#111827] text-right">
                      {fullLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              className="px-5 pt-3 border-t border-[#E5E7EB] bg-[#FFFDF9] shrink-0"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            >
              <button
                type="button"
                onClick={() => setSelectedPlanId(null)}
                className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] bg-white hover:bg-[#F9FAFB] active:scale-[0.98] text-sm font-bold text-[#111827] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {subscriptionPlan && (
        <SubscriptionModal
          mess={mess}
          plan={subscriptionPlan}
          onClose={() => setSubscriptionPlan(null)}
          onConfirm={(messId, planId, defaultPref) => {
            createSubscription(messId, planId, defaultPref);
            setSubscriptionPlan(null);
          }}
        />
      )}
    </div>
  );
};
