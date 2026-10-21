import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MealConfirmation } from '../../components/user/MealConfirmation';
import { MessCard } from '../../components/user/MessCard';
import { ErrorState } from '../../components/user/ErrorState';
import { useAuth } from '@clerk/react';

interface HomeScreenProps {
  onViewSubscriptions: () => void;
}
export const HomeScreen: React.FC<HomeScreenProps> = ({ onViewSubscriptions }) => {
  const {
    meals,
    refreshLiveMeals,
    apiError,
    retryError,
    updateMealStatus,
    setActiveTab,
    setSelectedMessId,
    setIsPaygModalOpen,
    setSelectedPaygMessId,
    toggleSubscriptionPreference,
    activeSubscriptions,
    publishedMesses,
    showSubscriptionHook,
    setShowSubscriptionHook,
    refreshActiveSubscriptions,
    refreshPublishedMesses,
    respondToMeal,
    showPaygBookingHook,
    setShowPaygBookingHook
  } = useApp();
  // Find today's meals
  const todayMeals = meals.filter((m) => m.displayDate === 'Today');

  // Find upcoming meals (excluding today)
  const upcomingMeals = meals.filter((m) => m.displayDate !== 'Today' && m.displayDate !== 'Yesterday');

  const hasActiveSubscription = activeSubscriptions.length > 0;
  console.log("HOME SUBSCRIPTION STATE", {
    activeSubscriptions,
    count: activeSubscriptions.length,
    hasActiveSubscription,
  });

  console.log('HOME HOOK:', showSubscriptionHook);
  const { isLoaded, isSignedIn } = useAuth();
  // useEffect(() => {
  //   console.log('HOME AUTH STATE:', {
  //     isLoaded,
  //     isSignedIn,
  //   });

  //   if (!isLoaded) {
  //     console.log('HOME: Clerk is not loaded');
  //     return;
  //   }

  //   if (!isSignedIn) {
  //     console.log('HOME: User is not signed in');
  //     return;
  //   }

  //   console.log('HOME: Calling refresh functions');

  //   refreshActiveSubscriptions();
  //   refreshPublishedMesses();
  // }, [
  //   isLoaded,
  //   isSignedIn,
  //   refreshActiveSubscriptions,
  //   refreshPublishedMesses,
  // ]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const loadHomeData = async () => {
      const subscriptions = await refreshActiveSubscriptions();

      await refreshLiveMeals(subscriptions.length > 0);
      await refreshPublishedMesses();
    };

    void loadHomeData();
  }, [
    isLoaded,
    isSignedIn,
    refreshActiveSubscriptions,
    refreshLiveMeals,
    refreshPublishedMesses,
  ]);
  // Error state (Scenario L)
  if (apiError) {
    return (
      <div className="p-4 space-y-4">
        <ErrorState message={apiError} onRetry={retryError} />
      </div>
    );
  }

  // ==========================================
  // CASE 1: NO ACTIVE SUBSCRIPTION (Section 7)
  // ==========================================
  if (!hasActiveSubscription) {
    return (
      <div className="p-4 space-y-5 pb-24">
        {/* Top Greeting */}
        <div>
          <span className="text-xs font-semibold text-[#6B7280]">Welcome to FlexiMeal</span>
          <h1 className="font-heading font-extrabold text-2xl text-[#111827] mt-0.5">
            Good morning 👋
          </h1>
        </div>

        {showSubscriptionHook && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <i className="fa-solid fa-receipt text-emerald-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment submitted
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Your Payment is awaiting verification. You can check its
                  details from your payments.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowSubscriptionHook(false);
                    onViewSubscriptions();
                  }}
                  className="mt-3 text-sm font-semibold text-emerald-700"
                >
                  View payment
                  <i className="fa-solid fa-arrow-right ml-1.5 text-xs" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSubscriptionHook(false)}
                className="shrink-0 text-gray-400"
                aria-label="Dismiss"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
        )}

        {/* Hero Card: Find your regular mess */}
        <div className="bg-gradient-to-br from-[#FFF8EE] via-[#FFFDF9] to-[#FFEDD5] rounded-2xl border border-[#FFEDD5] p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00] block mb-1">
            Local Mess Network
          </span>
          <h2 className="font-heading font-extrabold text-xl text-[#111827] leading-tight mb-2">
            Find your regular mess
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
            Discover messes near you and choose a meal plan that works for you. Flexible daily confirmations and simple monthly billing.
          </p>

          <button
            onClick={() => setActiveTab('discover')}
            className="w-full min-h-[48px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
          >
            <i className="fa-solid fa-compass text-sm"></i>
            <span>Explore Messes Near You</span>
          </button>
        </div>

        {/* Why FlexiMeal? 3 Concise Benefits (Strict Section 7 requirement) */}
        <div>
          <h2 className="font-heading font-bold text-sm text-[#111827] mb-2.5 flex items-center gap-1.5">
            <i className="fa-solid fa-star text-xs text-[#F59E0B]"></i>
            <span>Why FlexiMeal?</span>
          </h2>

          <div className="space-y-2">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-sm shrink-0">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#111827]">
                  Monthly meal plans
                </h3>
                <p className="text-[11px] text-[#6B7280] leading-normal">
                  Subscribe independently for Breakfast, Lunch, or Dinner at affordable monthly rates.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center text-sm shrink-0">
                <i className="fa-solid fa-toggle-on"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#111827]">
                  Flexible YES/NO meal confirmation
                </h3>
                <p className="text-[11px] text-[#6B7280] leading-normal">
                  Set default preferences and easily confirm or skip upcoming meals before cutoff.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] text-[#FF6B00] flex items-center justify-center text-sm shrink-0">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#111827]">
                  PAYG when you need it
                </h3>
                <p className="text-[11px] text-[#6B7280] leading-normal">
                  Grab a single meal token at any nearby mess without affecting your main subscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby / Popular Messes Preview */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-heading font-bold text-sm text-[#111827]">
              Nearby Messes
            </h2>
            <button
              onClick={() => setActiveTab('discover')}
              className="text-xs font-semibold text-[#DC2626] hover:underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-3">
            {publishedMesses.slice(0, 2).map((mess) => (
              <MessCard
                key={mess.profile_id}
                mess={mess}
                onSelect={(id) => {
                  setSelectedMessId(id);
                  setActiveTab('discover');
                }}
                onPaygClick={(id) => {
                  setSelectedPaygMessId(id);
                  setIsPaygModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: ACTIVE SUBSCRIPTION (Section 8)
  // Operational daily dashboard in priority order
  // ==========================================
  return (
    <div className="p-4 space-y-4 pb-24">
      {/* 1. Action Required Banner (Priority #1) */}
      {todayMeals.some((m) => m.status === 'unresponded') && (
        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center text-xs shrink-0 mt-0.5">
            <i className="fa-solid fa-bell animate-bounce"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#9A3412]">
                Action Required Today
              </span>
              <span className="text-[10px] text-[#C2410C] font-semibold">
                Cutoff Approaching
              </span>
            </div>
            <p className="text-[11px] text-[#7C2D12] mt-0.5">
              Confirm your today's meal before cutoff to ensure hot meal preparation.
            </p>
          </div>
        </div>
      )}

      {/* 2. Payment verification pending banner (Scenario H) */}
      {/* {pendingPayments.length > 0 && (
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-[#FDE68A] text-[#B45309] flex items-center justify-center text-xs shrink-0 mt-0.5">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#92400E]">
                Payment Verification Pending
              </span>
              <button
                onClick={() => verifyPendingPayment(pendingPayments[0].payment_id)}
                className="text-[10px] text-[#B45309] underline font-bold"
                title="Simulate mess owner approving payment"
              >
                [Simulate Verify]
              </button>
            </div>
            <p className="text-[11px] text-[#78350F] mt-0.5">
              {pendingPayments[0].meal_type} (UTR: {pendingPayments[0].utr}) submitted. Waiting for mess owner confirmation.
            </p>
          </div>
        </div>
      )} */}

      {/* 3. Today's Meal Hero Section (Priority #2 & #3) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-bold text-sm text-[#111827] flex items-center gap-1.5">
            <i className="fa-solid fa-bowl-rice text-xs text-[#DC2626]"></i>
            <span>Today's Meal</span>
          </h2>
          <span className="text-xs text-[#6B7280]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {todayMeals.length > 0 ? (
          <div className="space-y-3">
            {todayMeals.map((meal) => {
              const sub = activeSubscriptions.find((s) => s.meal_type === meal.mealType);
              return (
                <MealConfirmation
                  key={meal.id}
                  meal={meal}
                  subscription={sub}
                  onConfirm={async (newStatus) => {
                    const response =
                      newStatus === "explicit_yes" ? "YES" : "NO";

                    if (meal.confirmationId) {
                      await respondToMeal(meal.confirmationId, response);
                    } else {
                      updateMealStatus(meal.id, newStatus);
                    }
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center text-xs text-[#6B7280]">
            No scheduled meals for today.
          </div>
        )}
      </div>

      {/* 4. Upcoming Meals Section (Priority #6) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-bold text-sm text-[#111827]">
            Upcoming Meals
          </h2>
          <button
            onClick={() => setActiveTab('meals')}
            className="text-xs font-semibold text-[#DC2626] hover:underline"
          >
            View schedule
          </button>
        </div>

        {upcomingMeals.length > 0 ? (
          <div className="space-y-2">
            {upcomingMeals.slice(0, 2).map((meal) => {
              const sub = activeSubscriptions.find((s) => s.meal_type === meal.mealType);
              return (
                <MealConfirmation
                  key={meal.id}
                  meal={meal}
                  subscription={sub}
                  showCompact={true}
                  onConfirm={(newStatus) => updateMealStatus(meal.id, newStatus)}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-xs text-[#6B7280] text-center">
            No upcoming meals scheduled this week.
          </div>
        )}
      </div>

      {/* 5. Active Subscriptions (Priority #7) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-heading font-bold text-sm text-[#111827]">
              Your Meal Plans
            </h2>
            <span className="text-[10px] text-[#6B7280]">
              Independent plans per meal
            </span>
          </div>
          <button
            onClick={() => setActiveTab('more')}
            className="text-xs font-semibold text-[#DC2626] hover:underline"
          >
            Manage plans
          </button>
        </div>

        <div className="space-y-2">
          {activeSubscriptions.map((sub) => (
            <div
              key={sub.subscription_id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-heading font-bold text-sm text-[#111827] capitalize">
                    {sub.meal_type} Plan
                  </span>
                  <span className="text-[10px] font-semibold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#D1FAE5]">
                    Active
                  </span>
                </div>
                <div className="text-xs text-[#4B5563] mb-1">
                  {sub.mess_name} · ₹{sub.monthly_price.toLocaleString()}/mo
                </div>
                {/* <div className="text-[11px] text-[#6B7280] flex items-center gap-2">
                  <span>Default: <strong className="text-[#111827]">{sub.default_response}</strong></span>
                  <span>·</span>
                  <span>Cutoff: {sub.cutoff_time}</span>
                </div> */}
              </div>

              {/* Quick default preference switch button */}
              <div className="text-right">
                <button
                  onClick={() =>
                    toggleSubscriptionPreference(
                      sub.subscription_id,
                      sub.default_response === 'YES' ? 'NO' : 'YES'
                    )
                  }
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#D1D5DB] hover:bg-[#F3F4F6] text-[#374151] active:scale-95 transition-transform"
                >
                  Set Default {sub.default_response === 'YES' ? 'NO' : 'YES'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaygBookingHook && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <i className="fa-solid fa-receipt text-emerald-600" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Meal booked successfully
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                Your meal is reserved. View the details of your current booking.
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowPaygBookingHook(false);
                  setActiveTab('more');
                  // We'll connect this to the My Bookings screen.
                }}
                className="mt-3 text-sm font-semibold text-emerald-700"
              >
                View your current booking
                <i className="fa-solid fa-arrow-right ml-1.5 text-xs" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPaygBookingHook(false)}
              className="shrink-0 text-gray-400"
              aria-label="Dismiss"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      )}
      {/* 6. Want a meal somewhere else today? (PAYG Flow - Priority #8) */}
      <div className="bg-gradient-to-r from-[#FFF8EE] to-[#FFEDD5] rounded-2xl border border-[#FFEDD5] p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <span className="font-heading font-bold text-xs text-[#9A3412] block">
            Want a meal somewhere else today?
          </span>
          <span className="text-[11px] text-[#7C2D12]">
            Book a single meal token without cancelling your monthly plan.
          </span>
        </div>
        <button
          onClick={() => {
            setSelectedPaygMessId(null);
            setIsPaygModalOpen(true);
          }}
          className="min-h-[38px] px-3.5 py-1.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform shadow-xs shrink-0 ml-2"
        >
          Find PAYG Meal
        </button>
      </div>
    </div>
  );
};
