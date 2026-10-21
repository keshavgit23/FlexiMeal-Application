import React, { createContext, useContext, useState, useMemo } from 'react';
import { useCallback } from "react";
import { useAuth } from '@clerk/react';
import type { ReactNode } from 'react';
import type {
  ScheduledMeal,
  // PaymentRecord,
  AppNotification,
  ScenarioKey,
  MealStatus,
  MealType,
  SubscriptionPreference,
  PaygMeal,
} from '../types/user';
import { getMyActiveSubscriptions } from "../apis/user/subscriptions.api";
import type { ActiveSubscription } from "../apis/user/subscriptions.api";

import { getPublishedMesses } from '../apis/user/getPublishMesses.api';
import type { PublishedMess } from '../apis/user/getPublishMesses.api';
import { createPayment } from '../apis/user/createPayment.api';
import { getMyPayments } from '../apis/user/getUserPayments.api';
import type { Payment } from '../types/payment';
import { getMyLiveMeals } from '../apis/user/getMyLiveMeals.api';
import { respondToMealConfirmation, type MealConfirmationResponse, type RespondToMealConfirmationResponse } from "../apis/user/mealConfirmationResponse.api";
import { getPaygMeals } from '../apis/user/getPaygMeals.api';
import { createPaygBooking } from '../apis/user/createPaygBooking.api';
import type { PaygBooking } from '../apis/user/createPaygBooking.api';
import {
  getMyPaygBookings,
  type PaygBooking as MyPaygBooking,
} from '../apis/user/getMyPaygBookings.api';
interface AppContextType {
  // Navigation
  activeTab: 'home' | 'discover' | 'meals' | 'more';
  setActiveTab: (tab: 'home' | 'discover' | 'meals' | 'more') => void;
  selectedMessId: string | null;
  setSelectedMessId: (id: string | null) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isScenarioTesterOpen: boolean;
  setIsScenarioTesterOpen: (open: boolean) => void;
  isPaygModalOpen: boolean;
  setIsPaygModalOpen: (open: boolean) => void;
  selectedPaygMessId: string | null;
  setSelectedPaygMessId: (id: string | null) => void;
  isSubscribingMessId: string | null;
  setIsSubscribingMessId: (id: string | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  showSubscriptionHook: boolean;
  setShowSubscriptionHook: (show: boolean) => void;
  showPaygBookingHook: boolean;
  setShowPaygBookingHook: (show: boolean) => void;
  pendingPaymentDetails: {
    profileId: number;
    messName: string;
    amount: number;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    defaultResponse: 'YES' | 'NO';
  } | null;

  setPendingPaymentDetails: (
    details: {
      profileId: number;
      messName: string;
      amount: number;
      mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
      defaultResponse: 'YES' | 'NO';
    } | null
  ) => void;

  // Data
  user: { name: string; phone: string; location: string };
  meals: ScheduledMeal[];
  payments: Payment[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeSubscriptions: ActiveSubscription[];
  publishedMesses: PublishedMess[];
  paygMeals: PaygMeal[];
  myPaygBookings: MyPaygBooking[];
  isMyPaygBookingsLoading: boolean;
  myPaygBookingsError: string | null;

  // Scenario & Error
  activeScenario: ScenarioKey;
  setScenario: (scenario: ScenarioKey) => void;
  apiError: string | null;
  setApiError: (err: string | null) => void;
  retryError: () => void;
  emptyDiscoverFilter: boolean;
  setEmptyDiscoverFilter: (empty: boolean) => void;

  // Actions
  updateMealStatus: (mealId: string, status: MealStatus) => void;
  toggleSubscriptionPreference: (subId: number, newPref: SubscriptionPreference) => void;
  createSubscription: (messId: string, mealType: MealType, defaultPref: SubscriptionPreference) => void;
  // cancelSubscription: (subId: string) => void;
  submitPayment: (
    profileId: number,
    amount: number,
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER',
    defaultResponse: 'YES' | 'NO',
    utr: string,
    proofUrl?: string | null
  ) => Promise<any>;
  // verifyPendingPayment: (paymentId: number) => void;
  bookPaygMeal: (meal: PaygMeal) => Promise<PaygBooking>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  refreshActiveSubscriptions: () => Promise<ActiveSubscription[]>;
  refreshLiveMeals: (hasSubscriptions: boolean) => Promise<void>;
  refreshPublishedMesses: () => Promise<void>;
  refreshPayments: () => Promise<void>;

  respondToMeal: (
    confirmationId: number,
    response: MealConfirmationResponse
  ) => Promise<RespondToMealConfirmationResponse>;

  fetchPaygMeals: () => Promise<void>;
  isPaygMealsLoading: boolean;
  paygMealsError: string | null;
  refreshMyPaygBookings: () => Promise<MyPaygBooking[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'meals' | 'more'>('home');
  const [selectedMessId, setSelectedMessId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScenarioTesterOpen, setIsScenarioTesterOpen] = useState(false);
  const [isPaygModalOpen, setIsPaygModalOpen] = useState(false);
  const [selectedPaygMessId, setSelectedPaygMessId] = useState<string | null>(null);
  const [isSubscribingMessId, setIsSubscribingMessId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showSubscriptionHook, setShowSubscriptionHook] = useState(false);
  const [showPaygBookingHook, setShowPaygBookingHook] = useState(false);
  const [pendingPaymentDetails, setPendingPaymentDetails] = useState<{
    profileId: number;
    messName: string;
    amount: number;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    defaultResponse: 'YES' | 'NO';
  } | null>(null);


  // Scenario
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('B');
  const [apiError, setApiError] = useState<string | null>(null);
  const [emptyDiscoverFilter, setEmptyDiscoverFilter] = useState(false);

  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [publishedMesses, setPublishedMesses] = useState<PublishedMess[]>([]);
  const [paygMeals, setPaygMeals] = useState<PaygMeal[]>([]);
  const [isPaygMealsLoading, setIsPaygMealsLoading] = useState(false);
  const [paygMealsError, setPaygMealsError] = useState<string | null>(null);
  const [myPaygBookings, setMyPaygBookings] = useState<MyPaygBooking[]>([]);
  const [isMyPaygBookingsLoading, setIsMyPaygBookingsLoading] =
    useState(false);
  const [myPaygBookingsError, setMyPaygBookingsError] =
    useState<string | null>(null);

  const { getToken, isLoaded, isSignedIn } = useAuth();
  // User
  const [user] = useState({
    name: 'Krish Pawar',
    phone: '+91 98234 11204',
    location: 'Near FC Road, Pune',
  });

  // Scheduled meals
  const [meals, setMeals] = useState<ScheduledMeal[]>([]);

  // Payments
  const [payments, setPayments] = useState<Payment[]>([]);

  // Notifications
const [notifications, setNotifications] = useState<AppNotification[]>([]);
  // Scenario Presets Switcher
  const setScenario = (scenario: ScenarioKey) => {
    setActiveScenario(scenario);
    setApiError(null);
    setEmptyDiscoverFilter(false);

    switch (scenario) {
      case 'A': // New consumer with no subscription
        setMeals([]);
        setPayments([]);
        break;

      case 'B': // Consumer with Lunch subscription
        setMeals([
          {
            id: 'meal-today-lunch',
            date: '2026-09-27',
            displayDate: 'Today',
            mealType: 'LUNCH',
            messId: 'mess-1',
            messName: 'Rajeshwari Mess',
            menu: ['Dal Tadka', 'Steamed Rice', '3 Phulka Rotis', 'Aloo Gobi Sabzi', 'Curd & Pickle'],
            cutoffTime: '10:30 AM',
            status: 'unresponded',
          },
          {
            id: 'meal-tomorrow-lunch',
            date: '2026-09-28',
            displayDate: 'Tomorrow',
            mealType: 'LUNCH',
            messId: 'mess-1',
            messName: 'Rajeshwari Mess',
            menu: ['Chole Masala', 'Jeera Rice', 'Phulkas', 'Mix Veg Raita'],
            cutoffTime: '10:30 AM',
            status: 'unresponded',
          },
        ]);
        break;

      case 'C': // Consumer with Lunch + Dinner subscriptions (independent)
        setMeals([
          {
            id: 'meal-today-lunch',
            date: '2026-09-27',
            displayDate: 'Today',
            mealType: 'LUNCH',
            messId: 'mess-1',
            messName: 'Rajeshwari Mess',
            menu: ['Dal Tadka', 'Steamed Rice', '3 Phulka Rotis', 'Aloo Gobi Sabzi', 'Curd & Pickle'],
            cutoffTime: '10:30 AM',
            status: 'explicit_yes',
          },
          {
            id: 'meal-today-dinner',
            date: '2026-09-27',
            displayDate: 'Today',
            mealType: 'DINNER',
            messId: 'mess-2',
            messName: 'Annapurna Mess',
            menu: ['Moong Dal Khichdi with Ghee', 'Gujarati Kadhi', 'Phulkas', 'Kachumber'],
            cutoffTime: '5:00 PM',
            status: 'unresponded',
          },
        ]);
        break;

      case 'D': // Consumer has not responded to today's meal
        setMeals([
          {
            id: 'meal-today-lunch',
            date: '2026-09-27',
            displayDate: 'Today',
            mealType: 'LUNCH',
            messId: 'mess-1',
            messName: 'Rajeshwari Mess',
            menu: ['Dal Tadka', 'Steamed Rice', '3 Phulka Rotis', 'Aloo Gobi Sabzi', 'Curd & Pickle'],
            cutoffTime: '10:30 AM',
            status: 'unresponded',
          },
        ]);
        break;

      case 'E': // Consumer explicitly selected YES
        setMeals((prev) =>
          prev.map((m) => (m.id === 'meal-today-lunch' ? { ...m, status: 'explicit_yes' } : m))
        );
        break;

      case 'F': // Consumer explicitly selected NO
        setMeals((prev) =>
          prev.map((m) => (m.id === 'meal-today-lunch' ? { ...m, status: 'explicit_no' } : m))
        );
        break;

      case 'G': // Default YES was automatically applied
        setMeals((prev) =>
          prev.map((m) => (m.id === 'meal-today-lunch' ? { ...m, status: 'default_applied_yes' } : m))
        );
        break;

      case 'H': // Payment submitted but awaiting verification
        setPayments([
          {
            payment_id: 101,
            user_id: 'user_mock',
            profile_id: 1,
            amount: '2500',
            meal_type: 'LUNCH',
            default_response: 'YES',
            utr: 'UTR782910394012',
            proof_url: null,
            status: 'PENDING',
            verified_by: null,
            verified_at: null,
            rejection_reason: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            mess_name: 'Rajeshwari Mess',
          },
        ]);
        break;

      case 'I': // Payment verified (Paid)
        setPayments([
          {
            payment_id: 102,
            user_id: 'user_mock',
            profile_id: 1,
            amount: '2500',
            meal_type: 'LUNCH',
            default_response: 'YES',
            utr: 'UTR782910394012',
            proof_url: null,
            status: 'VERIFIED',
            verified_by: 'owner_mock',
            verified_at: new Date().toISOString(),
            rejection_reason: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            mess_name: 'Rajeshwari Mess',
          },
        ]);
        break;

      case 'J': // PAYG at another mess
        setSelectedPaygMessId('mess-2');
        setIsPaygModalOpen(true);
        break;

      case 'K': // No messes available in Discover
        setActiveTab('discover');
        setEmptyDiscoverFilter(true);
        break;

      case 'L': // Backend/API error
        setApiError('Unable to sync live cutoff times with mess servers. Please check connection and try again.');
        break;
    }
  };

  const retryError = () => {
    setApiError(null);
  };

  // Actions
  const updateMealStatus = (mealId: string, status: MealStatus) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, status } : m))
    );
  };

  const toggleSubscriptionPreference = (subId: number, newPref: SubscriptionPreference) => {
    setActiveSubscriptions((prev) =>
      prev.map((s) => (s.subscription_id === subId ? { ...s, default_response: newPref } : s))
    );
  };

  // const createSubscription = (
  //   messId: string,
  //   mealType: MealType,
  //   defaultPref: SubscriptionPreference
  // ) => {
  //   const mess = messes.find((m) => m.id === messId);
  //   if (!mess) return;
  //   const mealDetail = mess.meals[mealType];

  //   const newSub: Subscription = {
  //     id: `sub-${Date.now()}`,
  //     messId: mess.id,
  //     messName: mess.name,
  //     mealType,
  //     monthlyPrice: mealDetail.monthlyPrice,
  //     defaultPreference: defaultPref,
  //     status: 'active',
  //     startDate: 'Today',
  //     cutoffTime: mealDetail.cutoffTime,
  //   };

  //   setSubscriptions((prev) => {
  //     // Remove any existing subscription for this exact mealType (each meal is independent)
  //     const filtered = prev.filter((s) => s.mealType !== mealType);
  //     return [...filtered, newSub];
  //   });
  const createSubscription = (
    messId: string,
    mealType: MealType,
    defaultPref: SubscriptionPreference
  ) => {
    const mess = publishedMesses.find(
      (m) => m.profile_id === Number(messId)
    );

    if (!mess) {
      console.error('Mess not found:', messId);
      return;
    }

    const monthlyPrice = Number(mess.monthly_price);

    setPendingPaymentDetails({
      profileId: mess.profile_id,
      messName: mess.mess_name,
      amount: monthlyPrice,
      mealType: mealType.toUpperCase() as
        | 'BREAKFAST'
        | 'LUNCH'
        | 'DINNER',
      defaultResponse: defaultPref.toUpperCase() as 'YES' | 'NO',
    });

    setIsPaymentModalOpen(true);
  };

  //   // Add scheduled meal for today if it matches
  //   const newMeal: ScheduledMeal = {
  //     id: `meal-${Date.now()}`,
  //     date: '2026-09-27',
  //     displayDate: 'Today',
  //     mealType,
  //     messId: mess.id,
  //     messName: mess.name,
  //     menu: mealDetail.todayMenu,
  //     cutoffTime: mealDetail.cutoffTime,
  //     status: 'unresponded',
  //   };

  //   setMeals((prev) => {
  //     const filtered = prev.filter((m) => m.mealType !== mealType || m.displayDate !== 'Today');
  //     return [newMeal, ...filtered];
  //   });

  // Trigger payment instructions modal
  // setPendingPaymentDetails({
  //   profileId: mess.profile_id,
  //   messName: mess.mess_name,
  //   amount: Number(mealDetail.monthlyPrice),
  //   mealType: mealType.toUpperCase() as 'BREAKFAST' | 'LUNCH' | 'DINNER',
  //   defaultResponse: defaultPref.toUpperCase() as 'YES' | 'NO',
  // });

  const fetchPaygMeals = useCallback(async () => {
    try {
      setIsPaygMealsLoading(true);
      setPaygMealsError(null);

      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await getPaygMeals(token);
      setPaygMeals(response.data ?? []);
    } catch (error) {
      setPaygMealsError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch PAYG meals'
      );
    } finally {
      setIsPaygMealsLoading(false);
    }
  }, [getToken]);

  // const cancelSubscription = (subId: string) => {
  //   setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
  // };
  const refreshActiveSubscriptions = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) return [];

      const result = await getMyActiveSubscriptions(token);
      const subscriptions = result.data ?? [];

      setActiveSubscriptions(subscriptions);
      return subscriptions;
    } catch (error) {
      console.error("Failed to fetch active subscriptions:", error);
      return [];
    }
  }, [getToken]);

  const refreshLiveMeals = useCallback(
    async (hasSubscriptions: boolean) => {
      if (!hasSubscriptions) {
        setMeals([]);
        return;
      }

      try {
        const token = await getToken();

        if (!token) return;

        const result = await getMyLiveMeals(token);

        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());

        const mappedMeals: ScheduledMeal[] = result.data.map((meal) => ({
          id: meal.id,
          date: meal.date,
          displayDate:
            meal.date === today
              ? "Today"
              : meal.date > today
                ? meal.date
                : "Past",
          mealType: meal.mealType,
          messId: meal.messId,
          messName: meal.messName,
          menu: meal.menu,
          cutoffTime: meal.cutoffTime,
          status:
            meal.response === "YES"
              ? "explicit_yes"
              : meal.response === "NO"
                ? "explicit_no"
                : "unresponded",
          confirmationId: meal.confirmationId,
          responseOpen: meal.responseOpen,
        }));

        setMeals(mappedMeals);
      } catch (error) {
        console.error("Failed to fetch live meals:", error);
      }
    },
    [getToken]
  );
  const refreshPublishedMesses = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.warn("Authentication token not available");
        return;
      }

      const result = await getPublishedMesses(token);

      setPublishedMesses(result.data ?? []);
    } catch (error) {
      console.error("Failed to fetch published messes:", error);
    }
  }, [getToken]);

  const refreshPayments = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.warn('Authentication token not available');
        return;
      }

      const result = await getMyPayments(token);

      setPayments(result.data ?? []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  }, [getToken]);

  const respondToMeal = useCallback(
    async (
      confirmationId: number,
      response: MealConfirmationResponse
    ) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not available");
      }

      const result = await respondToMealConfirmation(
        token,
        confirmationId,
        response
      );

      // Refresh the live meal list to reflect the saved response.
      await refreshLiveMeals(activeSubscriptions.length > 0);

      return result;
    },
    [
      getToken,
      refreshLiveMeals,
      activeSubscriptions.length,
    ]
  );
  const submitPayment = async (
    profileId: number,
    amount: number,
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER',
    defaultResponse: 'YES' | 'NO',
    utr: string,
    proofUrl?: string | null
  ) => {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const result = await createPayment(token, {
        profileId,
        amount,
        mealType,
        defaultResponse,
        utr,
        proofUrl: proofUrl || null,
      });

      return result;
    } catch (error) {
      console.error('Payment submission failed:', error);
      throw error;
    }
  };

  // const verifyPendingPayment = (paymentId: number) => {
  //   setPayments((prev) =>
  //     prev.map((p) => (p.id === paymentId ? { ...p, status: 'verified' } : p))
  //   );
  // };

  // const bookPaygMeal = (messId: string, mealType: MealType) => {
  //   const mess = messes.find((m) => m.id === messId);
  //   if (!mess) return;
  //   const mealDetail = mess.meals[mealType];

  //   const paygMeal: ScheduledMeal = {
  //     id: `payg-${Date.now()}`,
  //     date: '2026-09-27',
  //     displayDate: 'Today',
  //     mealType,
  //     messId: mess.id,
  //     messName: `${mess.name} (PAYG)`,
  //     menu: mealDetail.todayMenu,
  //     cutoffTime: mealDetail.cutoffTime,
  //     status: 'explicit_yes',
  //     isPayg: true,
  //     paygPrice: mealDetail.paygPrice,
  //   };

  //   setMeals((prev) => [paygMeal, ...prev]);

  //   const newPay: PaymentRecord = {
  //     id: `payg-pay-${Date.now()}`,
  //     messId: mess.id,
  //     messName: mess.name,
  //     amount: mealDetail.paygPrice,
  //     date: 'Today',
  //     utr: `PAYG-${Math.floor(100000 + Math.random() * 900000)}`,
  //     status: 'verified',
  //     planType: `Single ${mealType.toUpperCase()} Meal (PAYG)`,
  //   };
  //   setPayments((prev) => [newPay, ...prev]);

  //   // Notification
  //   const newNotif: AppNotification = {
  //     id: `notif-${Date.now()}`,
  //     title: 'PAYG meal confirmed',
  //     message: `Single ${mealType} token booked at ${mess.name} (₹${mealDetail.paygPrice}). Show this in mess.`,
  //     time: 'Just now',
  //     type: 'subscription',
  //     read: false,
  //   };
  //   setNotifications((prev) => [newNotif, ...prev]);
  // };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const refreshMyPaygBookings = useCallback(async (): Promise<MyPaygBooking[]> => {
    if (!isLoaded || !isSignedIn) {
      setMyPaygBookings([]);
      return [];
    }

    setIsMyPaygBookingsLoading(true);
    setMyPaygBookingsError(null);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Unable to authenticate your bookings.');
      }

      const result = await getMyPaygBookings(token);
      setMyPaygBookings(result.data);

      return result.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch your bookings';

      setMyPaygBookingsError(message);
      throw error;
    } finally {
      setIsMyPaygBookingsLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  const bookPaygMeal = useCallback(
    async (meal: PaygMeal): Promise<PaygBooking> => {
      if (!isLoaded || !isSignedIn) {
        throw new Error('Please sign in to book a meal.');
      }

      const token = await getToken();

      if (!token) {
        throw new Error('Unable to authenticate your booking.');
      }

      const result = await createPaygBooking(token, {
        meal_id: meal.meal_id,
      });

      // The booking succeeded. Refresh the list for the home CTA.
      try {
        await refreshMyPaygBookings();
      } catch (error) {
        // Do not report booking failure when only refreshing failed.
        console.error('Failed to refresh PAYG bookings:', error);
      }

      return result.data;
    },
    [getToken, isLoaded, isSignedIn, refreshMyPaygBookings]
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedMessId,
        setSelectedMessId,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isScenarioTesterOpen,
        setIsScenarioTesterOpen,
        isPaygModalOpen,
        setIsPaygModalOpen,
        selectedPaygMessId,
        setSelectedPaygMessId,
        isSubscribingMessId,
        setIsSubscribingMessId,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        pendingPaymentDetails,
        setPendingPaymentDetails,
        user,
        activeSubscriptions,
        meals,
        notifications,
        unreadNotificationCount,
        activeScenario,
        setScenario,
        apiError,
        setApiError,
        retryError,
        emptyDiscoverFilter,
        setEmptyDiscoverFilter,
        updateMealStatus,
        toggleSubscriptionPreference,
        createSubscription,
        // cancelSubscription,
        submitPayment,
        // verifyPendingPayment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        bookPaygMeal,
        publishedMesses,
        showSubscriptionHook,
        setShowSubscriptionHook,
        showPaygBookingHook,
        setShowPaygBookingHook,
        refreshActiveSubscriptions,
        refreshPublishedMesses,
        payments,
        refreshPayments,
        refreshLiveMeals,
        respondToMeal,
        paygMeals,
        fetchPaygMeals,
        isPaygMealsLoading,
        paygMealsError,
        myPaygBookings,
        isMyPaygBookingsLoading,
        myPaygBookingsError,
        refreshMyPaygBookings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
