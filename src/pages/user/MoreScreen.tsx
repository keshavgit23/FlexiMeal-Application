import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatMealDate,
  formatMealTimeRange,
} from '../../utils/dateTime';
import { useClerk } from '@clerk/react';

interface MoreScreenProps {
  activeSection: 'menu' | 'subscriptions' | 'payments' | 'bookings';
  setActiveSection: (section: 'menu' | 'subscriptions' | 'payments' | 'bookings') => void;
}
export const MoreScreen: React.FC<MoreScreenProps> = ({ activeSection, setActiveSection }) => {
  const {
    user,
    activeSubscriptions,
    payments,
    refreshPayments,
    toggleSubscriptionPreference,
    setIsPaymentModalOpen,
    setPendingPaymentDetails,
    setIsNotificationsOpen,
    setActiveTab,
    myPaygBookings,
    isMyPaygBookingsLoading,
    myPaygBookingsError,
    refreshMyPaygBookings,
  } = useApp();
  const { signOut } = useClerk();
  useEffect(() => {
    if (activeSection === 'payments') {
      void refreshPayments();
    }

    if (activeSection === 'bookings') {
      void refreshMyPaygBookings().catch((error) => {
        console.error('Failed to load PAYG bookings:', error);
      });
    }
  }, [
    activeSection,
    refreshPayments,
    refreshMyPaygBookings,
  ]);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
          Account & Secondary Controls
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-[#111827]">
          More Options
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3.5 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FFF8EE] text-[#DC2626] border border-[#FFEDD5] flex items-center justify-center font-heading font-extrabold text-lg">
          {user.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base text-[#111827] truncate">
            {user.name}
          </h2>
          <p className="text-xs text-[#6B7280] truncate">
            {user.phone} · {user.location}
          </p>
        </div>
      </div>

      {/* SUB-SECTION 1: MAIN MENU TILES */}
      {activeSection === 'menu' && (
        <div className="space-y-3">
          {/* Subscriptions Hub Tile */}
          <button
            onClick={() => setActiveSection('subscriptions')}
            className="w-full bg-white rounded-xl border border-[#E5E7EB] p-3.5 flex items-center justify-between text-left hover:bg-[#F9FAFB] active:scale-98 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-sm">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#111827] block">
                  My Subscriptions
                </span>
                <span className="text-xs text-[#6B7280]">
                  {activeSubscriptions.length} active independent meal plan{activeSubscriptions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-[#9CA3AF]"></i>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('bookings')}
            className="w-full bg-white rounded-xl border border-[#E5E7EB] p-3.5 flex items-center justify-between text-left hover:bg-[#F9FAFB] active:scale-98 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center text-sm">
                <i className="fa-solid fa-utensils"></i>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#111827] block">
                  My PAYG Bookings
                </span>
                <span className="text-xs text-[#6B7280]">
                  View current and upcoming meal reservations
                </span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-[#9CA3AF]"></i>
          </button>

          {/* Payment History Tile */}
          <button
            onClick={() => setActiveSection('payments')}
            className="w-full bg-white rounded-xl border border-[#E5E7EB] p-3.5 flex items-center justify-between text-left hover:bg-[#F9FAFB] active:scale-98 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center text-sm">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#111827] block">
                  Payment History & Status
                </span>
                <span className="text-xs text-[#6B7280]">
                  Track manual UPI receipts and verification
                </span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-[#9CA3AF]"></i>
          </button>

          {/* Notifications Drawer Tile */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-full bg-white rounded-xl border border-[#E5E7EB] p-3.5 flex items-center justify-between text-left hover:bg-[#F9FAFB] active:scale-98 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] text-[#FF6B00] flex items-center justify-center text-sm">
                <i className="fa-regular fa-bell"></i>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#111827] block">
                  Alerts & Notifications
                </span>
                <span className="text-xs text-[#6B7280]">
                  Cutoff reminders & default preference updates
                </span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-[#9CA3AF]"></i>
          </button>

          {/* Logout Tile */}
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full bg-white rounded-xl border border-[#FEE2E2] p-3.5 flex items-center justify-between text-left hover:bg-[#FEF2F2] active:scale-98 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center text-sm">
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>

              <div>
                <span className="font-heading font-bold text-sm text-[#DC2626] block">
                  Logout
                </span>
                <span className="text-xs text-[#6B7280]">
                  Sign out of your FlexiMeal account
                </span>
              </div>
            </div>

            <i className="fa-solid fa-chevron-right text-xs text-[#9CA3AF]"></i>
          </button>
        </div>
      )}

      {/* SUB-SECTION 2: MY SUBSCRIPTIONS DETAIL */}
      {activeSection === 'subscriptions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5 hover:underline"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Back to Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className="text-xs font-bold text-[#16A34A] flex items-center gap-1"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
              <span>Add Plan</span>
            </button>
          </div>

          <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-xl p-3 text-xs text-[#9A3412]">
            <i className="fa-solid fa-circle-info mr-1"></i>
            <span>
              Each meal has its own subscription and default preference. You can set Breakfast at Mess A, Lunch at Mess B independently.
            </span>
          </div>

          {activeSubscriptions.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center text-xs text-[#6B7280]">
              <p className="font-semibold text-sm text-[#111827] mb-1">No Active Plans</p>
              <p className="mb-3">Subscribe to a mess plan to see it here.</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-4 py-2 bg-[#DC2626] text-white text-xs font-bold rounded-lg"
              >
                Browse Messes
              </button>
            </div>
          ) : (
            activeSubscriptions.map((sub) => (
              <div
                key={sub.subscription_id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-base text-[#111827] capitalize block">
                      {sub.meal_type} Subscription
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      {sub.mess_name}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-base text-[#DC2626]">
                    ₹{Number(sub.monthly_price ?? 0).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-[#6B7280]">/mo</span>
                  </span>
                </div>

                {/* Default Preference Setting */}
                <div className="pt-2 border-t border-[#F3F4F6]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">
                        Default Preference
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        Applied if no response before the meal's cutoff time
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F3F4F6] p-0.5 rounded-lg">
                      <button
                        onClick={() => toggleSubscriptionPreference(sub.subscription_id, 'YES')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sub.default_response === 'YES'
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'text-[#4B5563]'
                          }`}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => toggleSubscriptionPreference(sub.subscription_id, 'NO')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sub.default_response === 'NO'
                          ? 'bg-[#111827] text-white shadow-xs'
                          : 'text-[#4B5563]'
                          }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setPendingPaymentDetails({
                        profileId: sub.profile_id,
                        messName: sub.mess_name,
                        amount: Number(sub.monthly_price),
                        mealType: sub.meal_type,
                        defaultResponse: sub.default_response,
                      });
                      setIsPaymentModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <i className="fa-solid fa-receipt mr-1"></i>Pay / Renew Plan
                  </button>

                  {/* <button
                    onClick={() => cancelSubscription(sub.subscription_id)}
                    className="text-xs font-medium text-[#DC2626] hover:underline"
                  >
                    Cancel Plan
                  </button> */}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-SECTION 3: PAYG BOOKINGS */}
      {activeSection === 'bookings' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveSection('menu')}
              className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5 hover:underline"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Back to Menu</span>
            </button>

            <span className="text-xs text-[#6B7280]">
              PAYG Reservations
            </span>
          </div>

          <div>
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              My PAYG Bookings
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              View your current and upcoming single-meal bookings.
            </p>
          </div>

          {isMyPaygBookingsLoading ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center text-xs text-[#6B7280]">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Loading your bookings...
            </div>
          ) : myPaygBookingsError ? (
            <div className="bg-white rounded-xl border border-red-200 p-5 text-center">
              <p className="text-sm text-red-600">
                {myPaygBookingsError}
              </p>
              <button
                type="button"
                onClick={() => {
                  void refreshMyPaygBookings().catch(() => { });
                }}
                className="mt-3 text-xs font-bold text-[#DC2626] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : myPaygBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
                <i className="fa-solid fa-utensils text-lg"></i>
              </div>

              <p className="font-heading font-bold text-sm text-[#111827] mt-3">
                No current bookings
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Explore available meals and book a single meal whenever you need one.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveSection('menu');
                  setActiveTab('home');
                }}
                className="mt-4 px-4 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-lg"
              >
                Explore Meals
              </button>
            </div>
          ) : (
            myPaygBookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-sm text-[#111827]">
                      {booking.mess_name}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {booking.meal_type.charAt(0) +
                        booking.meal_type.slice(1).toLowerCase()}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full ${booking.meal_status === 'ACTIVE'
                      ? 'bg-[#ECFDF5] text-[#16A34A]'
                      : 'bg-[#EFF6FF] text-[#2563EB]'
                      }`}
                  >
                    {booking.meal_status === 'ACTIVE'
                      ? 'In progress'
                      : 'Upcoming'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#4B5563]">
                  <p>
                    <i className="fa-regular fa-calendar w-4 text-[#9CA3AF] mr-1"></i>
                    {formatMealDate(booking.meal_date)}
                  </p>
                  <p>
                    <i className="fa-regular fa-clock w-4 text-[#9CA3AF] mr-1"></i>
                    {formatMealTimeRange(
                      booking.start_time,
                      booking.end_time
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                  <span className="text-[11px] text-[#6B7280]">
                    Booking #{booking.booking_id}
                  </span>
                  <span className="font-heading font-bold text-sm text-[#111827]">
                    ₹{Number(booking.price ?? 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() => {
              setActiveSection('menu');
              setActiveTab('home');
            }}
            className="w-full rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white hover:bg-[#EA580C]"
          >
            Explore More Meals
          </button>
        </div>
      )}

      {/* SUB-SECTION 3: PAYMENTS DETAIL */}
      {activeSection === 'payments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5 hover:underline"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Back to Menu</span>
            </button>
            <span className="text-xs text-[#6B7280]">
              V1 Manual UPI
            </span>
          </div>

          <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-xl p-3 text-xs text-[#9A3412]">
            <p className="font-semibold mb-0.5">Verification Rule:</p>
            <p className="text-[11px]">
              Submitting a UTR reference marks your payment as <strong>Pending Verification</strong> until the mess owner confirms receipt in their bank app.
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center text-xs text-[#6B7280]">
              No payments submitted yet.
            </div>
          ) : (
            payments.map((p) => {
              const statusBadge = {
                PENDING: {
                  label: 'Pending verification',
                  bg: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
                  icon: 'fa-solid fa-hourglass-half',
                },
                VERIFIED: {
                  label: 'Paid (Verified)',
                  bg: 'bg-[#ECFDF5] text-[#16A34A] border-[#D1FAE5]',
                  icon: 'fa-solid fa-circle-check',
                },
                REJECTED: {
                  label: 'Payment rejected',
                  bg: 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]',
                  icon: 'fa-solid fa-circle-xmark',
                },
              }[p.status];

              return (
                <div
                  key={p.payment_id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-heading font-bold text-xs text-[#111827] block">
                        {p.mess_name}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        {p.meal_type} · {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-heading font-extrabold text-sm text-[#111827]">
                      ₹{Number(p.amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F3F4F6] text-[11px]">
                    <span className="font-mono text-[#6B7280]">UTR: {p.utr}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${statusBadge.bg}`}
                    >
                      <i className={`${statusBadge.icon} text-[10px]`}></i>
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
