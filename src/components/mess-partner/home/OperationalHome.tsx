import React, { useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import type {
    MessOwnerData,
    OperationalTab,
} from '../../../types/messOnboarding';
import { StatusBadge } from '../shared/StatusBadge';
import { ShiftHero } from './ShiftHero';
import { MenuSection } from './MenuSection';
import { NextShift } from './NextShift';
import { ListingStatus } from './ListingStatus';
import { OperationalBottomNav } from './OperationalBottomNav';
import { EmptyState } from '../shared/StateView';

import type { CurrentMeal } from '../../../apis/mess-partner/operational.api';
import { getCurrentMeal } from '../../../apis/mess-partner/operational.api';
import Toast from '../../ui-elements/Toast';
import type { ToastType } from '../../../types/ui-elements/toast';
import { useRecentPaymentStatus } from '../../../hooks/useRecentPaymentStatus';
import { PaymentsDrawer } from "./PaymentsDrawer";
import { goLiveMeal } from "../../../apis/mess-partner/goLiveMeal.api";
import { useToast } from "../../../context/ToastContext";
import { getMealConfirmationsSummary, type MealConfirmationsSummary } from '../../../apis/mess-partner/getMealConfirmationsSummary.api';
import { getMessOwnerMeals, type MessOwnerMeal } from '../../../apis/mess-partner/getMessOwnerMeals.api';
import { cancelMeal } from '../../../apis/mess-partner/cancelMeal.api';
import PaygSettingsDrawer from './settings/PaygSettingsDrawer';

export interface OperationalHomeProps {
    messData: MessOwnerData;
    onEditProfile: () => void;
    onPreviewStudentView: () => void;
    toast: {
        type: ToastType;
        message: string;
    } | null;

    onToastClose: () => void;
}

export const OperationalHome: React.FC<OperationalHomeProps> = ({
    messData,
    onEditProfile,
    onPreviewStudentView,
    toast,
    onToastClose,
}) => {
    // const [activeTab, setActiveTab] = useState<OperationalTab>('shift');
    // const [operationalMode, setOperationalMode] =
    //     useState<OperationalStatusMode>('NORMAL');
    // const [shiftData, setShiftData] = useState<ShiftData>(INITIAL_SHIFT_DATA);
    const { showToast } = useToast();

    const [activeTab, setActiveTab] =
        useState<OperationalTab>('shift');

    const [currentMeal, setCurrentMeal] = useState<CurrentMeal | null>(null);

    const [mealStatus, setMealStatus] = useState<'NONE' | 'UPCOMING' | 'ACTIVE'>('NONE');

    const [isLoadingMeal, setIsLoadingMeal] = useState(true);

    const [mealError, setMealError] = useState(false);

    const [showPaymentsDrawer, setShowPaymentsDrawer] = useState(false);
    const [confirmationSummary, setConfirmationSummary] = useState<MealConfirmationsSummary | null>(null);

    const [allMeals, setAllMeals] = useState<MessOwnerMeal[]>([]);
    const [isLoadingMeals, setIsLoadingMeals] = useState(false);
    const [isLoadingConfirmations, setIsLoadingConfirmations] = useState(false);
    const [confirmationError, setConfirmationError] = useState<string | null>(null);

    const [showPaygSettings, setShowPaygSettings] = useState(false);

    const shiftData = currentMeal && confirmationSummary
        ? {
            shiftName:
                currentMeal.mealType.charAt(0) +
                currentMeal.mealType.slice(1).toLowerCase() as
                | "Breakfast"
                | "Lunch"
                | "Dinner",

            cutoffTimeRemaining: (() => {
                const [hours, minutes, seconds = "0"] =
                    currentMeal.cutoffTime.split(":");

                const cutoff = new Date();
                cutoff.setHours(
                    Number(hours),
                    Number(minutes),
                    Number(seconds),
                    0
                );

                return Math.max(
                    0,
                    Math.floor(
                        (cutoff.getTime() - Date.now()) / 1000
                    )
                );
            })(),

            totalMealsToPrepare: confirmationSummary.total,

            portionBreakdown: {
                subscribed: confirmationSummary.explicitYes,
                defaultMeals: confirmationSummary.defaultYes,
                payg: confirmationSummary.payg,
            },

            menuToCook: currentMeal.menuItems.map(
                (item) => item.itemName
            ),

            nextShift: {
                name: "Not scheduled",
                timing: "--",
                expectedMeals: 0,
            },
        }
        : null;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const { signOut } = useClerk();

    const {
        hasRecentPayments,
        pendingCount,
    } = useRecentPaymentStatus();
    const showActiveMealUI =
        !isLoadingMeal &&
        !mealError &&
        mealStatus === 'ACTIVE' &&
        currentMeal;

    // useEffect(() => {
    //     const fetchCurrentMeal = async () => {
    //         try {
    //             setIsLoadingMeal(true);
    //             setMealError(false);

    //             const token = await getToken();

    //             if (!token) {
    //                 throw new Error('Authentication token not available');
    //             }

    //             const response = await getCurrentMeal(token);

    //             if (!response.success || !response.data) {
    //                 throw new Error(
    //                     response.message || 'Failed to get current meal'
    //                 );
    //             }

    //             setMealStatus(response.data.status);
    //             setCurrentMeal(response.data.meal);
    //         } catch (error) {
    //             console.error(
    //                 'Failed to fetch current meal:',
    //                 error
    //             );

    //             setMealError(true);
    //             setCurrentMeal(null);
    //             setMealStatus('NONE');
    //         } finally {
    //             setIsLoadingMeal(false);
    //         }
    //     };

    //     fetchCurrentMeal();
    // }, [getToken]);

    useEffect(() => {
        const fetchDashboardMeals = async () => {
            try {
                setIsLoadingMeal(true);
                setMealError(false);
                setIsLoadingMeals(true);

                const token = await getToken();

                if (!token) {
                    throw new Error("Authentication token not available");
                }

                // Load the existing current-meal UI
                const response = await getCurrentMeal(token);

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Failed to get current meal"
                    );
                }

                setMealStatus(response.data.status);
                setCurrentMeal(response.data.meal);

                // Load all meals for the multiple-meal list
                const meals = await getMessOwnerMeals(token);
                console.log("Fetched meals:", meals);
                setAllMeals(meals);
            } catch (error) {
                console.error("Failed to fetch dashboard meals:", error);
                setMealError(true);
                setCurrentMeal(null);
                setMealStatus("NONE");
            } finally {
                setIsLoadingMeal(false);
                setIsLoadingMeals(false);
            }
        };

        fetchDashboardMeals();
    }, [getToken]);

    useEffect(() => {
        if (
            mealStatus !== "ACTIVE" ||
            !currentMeal?.mealId
        ) {
            setConfirmationSummary(null);
            return;
        }

        let cancelled = false;

        const fetchSummary = async () => {
            setIsLoadingConfirmations(true);
            setConfirmationError(null);

            try {
                const token = await getToken();

                if (!token) {
                    throw new Error("Authentication token unavailable");
                }
                const summary = await getMealConfirmationsSummary(
                    token,
                    currentMeal.mealId
                );

                console.log(
                    "Fetched meal confirmations summary:",
                    summary
                );
                if (!cancelled) {
                    setConfirmationSummary(summary);
                }
            } catch (error) {
                if (!cancelled) {
                    setConfirmationError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load confirmations"
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingConfirmations(false);
                }
            }
        };

        fetchSummary();

        return () => {
            cancelled = true;
        };
    }, [mealStatus, currentMeal?.mealId, getToken]);

    // useEffect(() => {

    //     console.log('HOME LOCATION STATE:', location.state);
    //     if (location.state?.toast) {
    //         console.log('TOAST RECEIVED:', location.state.toast);
    //         setToast(location.state.toast);

    //         navigate(location.pathname, {
    //             replace: true,
    //             state: {},
    //         });
    //     }
    // }, [location, navigate]);
    console.log("allMeals:", allMeals);
    console.log("isLoadingMeals:", isLoadingMeals);
    const fetchAllMeals = async () => {
        setIsLoadingMeals(true);

        try {
            const token = await getToken();
            if (!token) return;

            const meals = await getMessOwnerMeals(token);
            console.log("Hello meals:", meals);
            setAllMeals(meals);
        } catch (error) {
            console.error("Failed to fetch meals:", error);
        } finally {
            setIsLoadingMeals(false);
        }
    };

    const handleGoLive = async (mealId: number) => {
        try {
            const token = await getToken();

            if (!token) {
                throw new Error("Authentication token not available");
            }

            // 1. Go live for the selected meal
            const result = await goLiveMeal(token, mealId);

            if (!result.success) {
                throw new Error(result.message || "Failed to start meal");
            }

            // 2. Refresh the current meal
            const response = await getCurrentMeal(token);

            if (!response.success || !response.data) {
                throw new Error("Meal started, but refreshing the meal failed");
            }

            setMealStatus(response.data.status);
            setCurrentMeal(response.data.meal);

            // 3. Refresh the complete meal list
            await fetchAllMeals();

            showToast("Meal is now Live!", "success");
        } catch (error) {
            console.error("Failed to go live:", error);
            showToast(
                error instanceof Error
                    ? error.message
                    : "Failed to start meal",
                "error"
            );
        }
    };

    const handleCancelMeal = async (mealId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this active meal?"
        );

        if (!confirmed) return;

        try {
            const token = await getToken();

            if (!token) {
                throw new Error("Authentication required");
            }

            await cancelMeal(token, mealId);

            // Refresh the meals list using your existing fetch function.
            await fetchAllMeals();
        } catch (error) {
            console.error("Failed to cancel meal:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel meal"
            );
        }

    };
    // const handleGoLive = async () => {
    //     if (!currentMeal) return;

    //     try {
    //         const token = await getToken();

    //         if (!token) {
    //             throw new Error("Authentication token not available");
    //         }

    //         // 1. Update the meal status in the database
    //         const result = await goLiveMeal(token, currentMeal.mealId);

    //         if (!result.success) {
    //             throw new Error(result.message || "Failed to start meal");
    //         }

    //         // 2. Reuse the existing API to refresh the meal
    //         const response = await getCurrentMeal(token);

    //         if (!response.success || !response.data) {
    //             throw new Error("Meal started, but refreshing the meal failed");
    //         }

    //         setMealStatus(response.data.status);
    //         setCurrentMeal(response.data.meal);

    //         showToast("Meal is now Live!", "success");
    //     } catch (error) {
    //         console.error("Failed to go live:", error);
    //         showToast(
    //             error instanceof Error
    //                 ? error.message
    //                 : "Failed to start meal",
    //             "error"
    //         );
    //     }
    // };
    return (
        <div className="flex flex-col min-h-full bg-stone-100">
            {/* TOP APP HEADER */}

            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-sm font-bold font-heading shadow-xs shrink-0">
                            <i className="fa-solid fa-utensils" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black text-gray-900 font-heading truncate tracking-tight">
                                    {messData.name}
                                </h1>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <i className="fa-solid fa-location-dot text-emerald-700 text-[10px]" />
                                <span className="truncate">{messData.address}, {messData.city}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status="LIVE" size="md" />
                    </div>
                </div>


                {/* Operational State Switcher (for testing the required empty/error/completed states) */}
                {false && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-1.5 text-[11px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                            Simulate State:
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                            {/* <button
                            type="button"
                            onClick={() => setOperationalMode('NORMAL')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${operationalMode === 'NORMAL'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Active Shift
                        </button> */}
                            {/* <button
                            type="button"
                            onClick={() => setOperationalMode('EMPTY')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${operationalMode === 'EMPTY'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            No Meal
                        </button>
                        <button
                            type="button"
                            onClick={() => setOperationalMode('COMPLETED')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${operationalMode === 'COMPLETED'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Shift Done
                        </button>
                        <button
                            type="button"
                            onClick={() => setOperationalMode('ERROR')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${operationalMode === 'ERROR'
                                ? 'bg-red-700 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Error
                        </button> */}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 py-5 pb-24 space-y-4 max-w-md mx-auto w-full pb-8">
                {/* TAB 1: SHIFT (KITCHEN OPERATIONS) */}
                {activeTab === 'shift' && (
                    <>
                        {showActiveMealUI && isLoadingConfirmations && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm text-center space-y-2 animate-in fade-in duration-200">
                                <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-700" />
                                <p className="text-sm font-semibold text-gray-900">Updating shift headcount...</p>
                                <p className="text-xs text-gray-500">Syncing live student confirmations with kitchen orders.</p>
                            </div>
                        )}

                        {showActiveMealUI && !isLoadingConfirmations && confirmationError && (
                            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
                                <i className="fa-solid fa-circle-exclamation text-base shrink-0 text-red-600" />
                                <div className="flex-1 min-w-0">
                                    <span className="font-semibold block text-red-900">Failed to load meal confirmations</span>
                                    <span>{confirmationError}</span>
                                </div>
                            </div>
                        )}

                        {showActiveMealUI && !isLoadingConfirmations && shiftData && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* HERO: CURRENT SHIFT + 185 MEALS TO PREPARE */}
                                <ShiftHero shift={shiftData} />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/mess-partner/meals')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                    >
                                        <i className="fa-solid fa-plus" aria-hidden="true" />
                                        Add Another Meal
                                    </button>
                                </div>

                                <MenuSection
                                    initialMenuItems={currentMeal.menuItems.map(
                                        (item) => item.itemName
                                    )}
                                />

                                {/* NEXT SHIFT PREVIEW */}
                                <NextShift
                                    shiftName={shiftData.nextShift.name}
                                    timing={shiftData.nextShift.timing}
                                    expectedMeals={shiftData.nextShift.expectedMeals}
                                />

                                {/* LIVE LISTING STATUS CARD */}
                                <ListingStatus
                                    monthlyPrice={messData.monthlyPrice}
                                    onEditProfile={onEditProfile}
                                    onPreviewStudentView={onPreviewStudentView}
                                />
                            </div>
                        )}

                        {activeTab === "shift" && (
                            console.log("Rendering Today's Meals section", activeTab),
                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Today's Meals
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/mess-partner/meals")}
                                        className="text-sm font-semibold text-emerald-700"
                                    >
                                        + Add Meal
                                    </button>
                                </div>

                                {isLoadingMeals ? (
                                    <p className="text-sm text-gray-500">Loading meals...</p>
                                ) : (
                                    allMeals.map((meal) => (
                                        <div
                                            key={meal.mealId}
                                            className="rounded-2xl border border-gray-200 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {meal.mealType.charAt(0) +
                                                            meal.mealType.slice(1).toLowerCase()}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {meal.startTime.slice(0, 5)} –{" "}
                                                        {meal.endTime.slice(0, 5)}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meal.status === "ACTIVE"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {meal.status}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm text-gray-600">
                                                {meal.menuItems.map((item) => item.itemName).join(", ")}
                                            </p>

                                            {meal.status === "UPCOMING" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleGoLive(meal.mealId)}
                                                    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Go Live
                                                </button>
                                            )}

                                            {meal.status === "ACTIVE" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelMeal(meal.mealId)}
                                                    className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600"
                                                >
                                                    Cancel Meal
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </section>
                        )}

                        {/* EMPTY STATE: NO MEAL SCHEDULED */}
                        {!isLoadingMeal && !mealError && mealStatus === 'NONE' && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                <EmptyState
                                    icon="fa-solid fa-calendar-xmark"
                                    title="No meal scheduled yet"
                                    description="Create today's meal to start managing kitchen demand and receive student headcounts."
                                    primaryAction={{
                                        label: "Add Today's Meal",
                                        onClick: () => {
                                            navigate('/mess-partner/meals');
                                        },
                                        variant: 'primary',
                                    }}
                                />
                            </div>
                        )}

                        {hasRecentPayments && (
                            <div
                                className="mb-4 overflow-hidden rounded-2xl border"
                                style={{
                                    backgroundColor: "var(--color-surface)",
                                    borderColor: "var(--primitive-amber-300)",
                                    boxShadow: "var(--shadow-resting)",
                                }}
                            >
                                <div
                                    className="p-4"
                                    style={{
                                        backgroundColor: "var(--primitive-amber-100)",
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: "var(--primitive-amber-300)",
                                            }}
                                        >
                                            <i
                                                className="fa-solid fa-receipt text-sm"
                                                style={{
                                                    color: "var(--primitive-gray-800)",
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3
                                                    className="font-heading text-sm font-bold"
                                                    style={{
                                                        color: "var(--color-text-primary)",
                                                    }}
                                                >
                                                    New payment received
                                                </h3>

                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                    style={{
                                                        backgroundColor: "var(--primitive-white)",
                                                        color: "var(--primitive-amber-500)",
                                                    }}
                                                >
                                                    ACTION NEEDED
                                                </span>
                                            </div>

                                            <p
                                                className="mt-1 text-xs leading-5"
                                                style={{
                                                    color: "var(--color-text-secondary)",
                                                }}
                                            >
                                                {pendingCount === 1
                                                    ? "A customer has submitted a payment for verification."
                                                    : `${pendingCount} customer payments are waiting for verification.`}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => setShowPaymentsDrawer(true)}
                                                className="mt-3 inline-flex items-center font-body text-sm font-bold transition-opacity hover:opacity-80"
                                                style={{
                                                    color: "var(--color-role-owner-primary)",
                                                }}
                                            >
                                                Review payments
                                                <i className="fa-solid fa-arrow-right ml-1.5 text-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* UPCOMING MEAL */}
                        {!isLoadingMeal &&
                            !mealError &&
                            mealStatus === 'UPCOMING' &&
                            currentMeal && (
                                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                    {/* Header */}
                                    {toast && (
                                        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm">
                                            <Toast
                                                type={toast.type}
                                                message={toast.message}
                                                duration={3000}
                                                onClose={onToastClose}
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                Upcoming Meal
                                            </p>

                                            <h2 className="text-xl font-black text-gray-900 font-heading mt-1">
                                                {currentMeal.mealType}
                                            </h2>
                                        </div>

                                        <StatusBadge
                                            status="UPCOMING"
                                            size="md"
                                        />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl bg-stone-50 p-4">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-gray-900">
                                                {new Date(
                                                    currentMeal.mealDate
                                                ).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-stone-50 p-4">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Time
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-gray-900">
                                                {currentMeal.startTime.slice(0, 5)}
                                                {' – '}
                                                {currentMeal.endTime.slice(0, 5)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cutoff */}
                                    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-100 p-4">
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <i className="fa-solid fa-clock" />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                                                Booking Cutoff
                                            </p>

                                            <p className="text-sm font-bold text-gray-900">
                                                {currentMeal.cutoffTime.slice(0, 5)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="mt-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Today's Menu
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentMeal.menuItems.map((item) => (
                                                <span
                                                    key={item.menuItemId}
                                                    className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-sm font-semibold"
                                                >
                                                    {item.itemName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PAYG */}
                                    <div className="mt-5 flex items-center justify-between py-3 border-t border-gray-100">
                                        <span className="text-sm font-semibold text-gray-600">
                                            Pay-as-you-go
                                        </span>

                                        <span className="text-sm font-bold text-gray-900">
                                            {currentMeal.payAsYouGo ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>

                                    {/* Go Live */}
                                    <button
                                        type="button"
                                        onClick={() => handleGoLive(currentMeal.mealId)}
                                        className="w-full mt-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 transition-colors"
                                    >
                                        Go Live
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate(
                                                `/mess-partner/meals?mealId=${currentMeal.mealId}`
                                            );
                                        }}
                                        className="w-full rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 transition-colors"
                                    >
                                        Edit Meal
                                    </button>
                                </div>
                            )}

                        {/* {false && operationalMode === 'COMPLETED' && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                <SuccessState
                                    icon="fa-solid fa-circle-check"
                                    title="Shift completed"
                                    description="Lunch service is closed. Your next shift is Dinner (7:30 PM - 10:00 PM)."
                                    primaryAction={{
                                        label: 'View Next Shift (Dinner)',
                                        onClick: () => {
                                            setShiftData({
                                                ...shiftData,
                                                shiftName: 'Dinner',
                                                totalMealsToPrepare: 160,
                                                portionBreakdown: {
                                                    subscribed: 110,
                                                    defaultMeals: 35,
                                                    payg: 15,
                                                },
                                            });
                                            setOperationalMode('NORMAL');
                                        },
                                        variant: 'primary',
                                    }}
                                    secondaryAction={{
                                        label: 'Reset to Lunch Shift',
                                        onClick: () => setOperationalMode('NORMAL'),
                                    }}
                                />
                            </div>
                        )} */}

                        {/* ERROR STATE: UNABLE TO LOAD KITCHEN DATA */}
                        {/* {false && operationalMode === 'ERROR' && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                <ErrorState
                                    icon="fa-solid fa-triangle-exclamation"
                                    title="Unable to load today's kitchen data"
                                    description="A temporary network issue occurred while syncing active subscriptions. Check connection and retry."
                                    retryAction={() => setOperationalMode('NORMAL')}
                                    secondaryAction={{
                                        label: 'Continue in offline mode',
                                        onClick: () => setOperationalMode('NORMAL'),
                                    }}
                                />
                            </div>
                        )} */}
                    </>
                )}

                {/* TAB 2: SCHEDULE */}
                {activeTab === 'schedule' && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4 animate-in fade-in duration-200">
                        <div>
                            <h3 className="text-base font-black font-heading text-gray-900">
                                Scheduled Meals
                            </h3>
                            <p className="text-xs text-gray-500">
                                Your upcoming kitchen schedule
                            </p>
                        </div>

                        {isLoadingMeals ? (
                            <p className="text-sm text-gray-500 text-center py-8">
                                Loading scheduled meals...
                            </p>
                        ) : allMeals.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                                <i className="fa-regular fa-calendar text-2xl text-gray-400 mb-3" />

                                <p className="text-sm font-bold text-gray-800">
                                    No scheduled meals
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Your upcoming meals will appear here once scheduled.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(
                                    allMeals.reduce<Record<string, typeof allMeals>>(
                                        (groups, meal) => {
                                            // Assumes mealDate starts with YYYY-MM-DD.
                                            // See the date-format note below.
                                            const date = new Intl.DateTimeFormat('en-CA', {
                                                timeZone: 'Asia/Kolkata',
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            }).format(new Date(meal.mealDate));

                                            if (!groups[date]) {
                                                groups[date] = [];
                                            }

                                            groups[date].push(meal);
                                            return groups;
                                        },
                                        {}
                                    )
                                )
                                    .sort(([dateA], [dateB]) =>
                                        dateA.localeCompare(dateB)
                                    )
                                    .map(([date, meals]) => (
                                        <div key={date} className="space-y-2">
                                            <h4 className="text-sm font-bold text-gray-800">
                                                {new Date(`${date}T12:00:00`).toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'short',
                                                    }
                                                )}
                                            </h4>

                                            {meals
                                                .slice()
                                                .sort((a, b) => {
                                                    const order = {
                                                        BREAKFAST: 1,
                                                        LUNCH: 2,
                                                        DINNER: 3,
                                                    };

                                                    return order[a.mealType] - order[b.mealType];
                                                })
                                                .map((meal) => (
                                                    <div
                                                        key={meal.mealId}
                                                        className="rounded-xl border border-gray-200 bg-stone-50 p-3 space-y-2"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {meal.mealType.charAt(0) +
                                                                        meal.mealType.slice(1).toLowerCase()}
                                                                </p>

                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {meal.startTime.slice(0, 5)} –{' '}
                                                                    {meal.endTime.slice(0, 5)}
                                                                </p>
                                                            </div>

                                                            <span
                                                                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${meal.status === 'ACTIVE'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-amber-100 text-amber-800'
                                                                    }`}
                                                            >
                                                                {meal.status === 'ACTIVE'
                                                                    ? 'Live'
                                                                    : 'Upcoming'}
                                                            </span>
                                                        </div>

                                                        {meal.menuItems.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {meal.menuItems.map((item) => (
                                                                    <span
                                                                        key={item.menuItemId}
                                                                        className="rounded-md bg-white border border-gray-200 px-2 py-1 text-xs text-gray-700"
                                                                    >
                                                                        {item.itemName}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-500">
                                                                No menu items added
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}


                {/* TAB 3: LISTING */}
                {activeTab === 'listing' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black font-heading text-gray-900">
                                    Public Mess Listing
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Visible to college students in Pune
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onPreviewStudentView}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-eye text-[11px]" />
                                <span>Student View</span>
                            </button>
                        </div>

                        <ListingStatus
                            monthlyPrice={messData.monthlyPrice}
                            onEditProfile={onEditProfile}
                            onPreviewStudentView={onPreviewStudentView}
                        />

                        {/* Quick Listing Info Card */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading">
                                Listing Configuration
                            </div>

                            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                                <span className="text-gray-500">Mess Name</span>
                                <span className="font-bold text-gray-900">{messData.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                                <span className="text-gray-500">Location</span>
                                <span className="font-bold text-gray-900">
                                    {messData.address}, {messData.city}, {messData.state}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                                <span className="text-gray-500">Food Type</span>
                                <span className="font-bold text-emerald-800">
                                    {messData.foodType === 'PURE_VEG'
                                        ? 'Pure Vegetarian'
                                        : 'Veg & Non-Veg'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                                <span className="text-gray-500">Active Monthly Rate</span>
                                <span className="font-bold text-emerald-800">
                                    ₹{messData.monthlyPrice?.toLocaleString('en-IN')}/month
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1">
                                <span className="text-gray-500">Meal Availability</span>
                                <span className="font-bold text-gray-900 capitalize">
                                    {[
                                        ...(messData.offersBreakfast ? ['breakfast'] : []),
                                        ...(messData.offersLunch ? ['lunch'] : []),
                                        ...(messData.offersDinner ? ['dinner'] : []),
                                    ].join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: SETTINGS */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4 animate-in fade-in duration-200">
                        <div>
                            <h3 className="text-base font-black font-heading text-gray-900">
                                Mess Settings &amp; Operations
                            </h3>
                            <p className="text-xs text-gray-500">
                                Configure shift cutoff times &amp; kitchen notifications
                            </p>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">
                                        Lunch Order Cutoff
                                    </div>
                                    <div className="text-gray-500 text-[11px]">
                                        Time after which headcounts lock
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                                    11:30 AM
                                </span>
                            </div>

                            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">
                                        Dinner Order Cutoff
                                    </div>
                                    <div className="text-gray-500 text-[11px]">
                                        Time after which headcounts lock
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                                    6:45 PM
                                </span>
                            </div>

                            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">
                                        Buffer Meals (+10%)
                                    </div>
                                    <div className="text-gray-500 text-[11px]">
                                        Automatic extra headcounts for walk-ins
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                    Enabled
                                </span>
                            </div>

                            <div
                                className="p-3 rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => setShowPaygSettings(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <i className="fa-solid fa-utensils text-emerald-700"></i>
                                    </div>

                                    <div>
                                        <div className="font-bold text-gray-900">
                                            PAYG Meal Prices
                                        </div>

                                        <div className="text-gray-500 text-[11px]">
                                            Set individual breakfast, lunch and dinner prices
                                        </div>
                                    </div>
                                </div>

                                <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                            </div>

                            <div
                                className="p-3 rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => setShowPaymentsDrawer(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <i className="fa-solid fa-money-bill-transfer text-emerald-700"></i>
                                    </div>

                                    <div>
                                        <div className="font-bold text-gray-900">
                                            Payments
                                        </div>

                                        <div className="text-gray-500 text-[11px]">
                                            Review and verify customer payments
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {pendingCount > 0 && (
                                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                            {pendingCount} pending
                                        </span>
                                    )}

                                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <button
                                    onClick={() => signOut()}
                                    className="w-full p-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition"
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showPaymentsDrawer && (
                <PaymentsDrawer
                    onClose={() => setShowPaymentsDrawer(false)}
                />
            )}

            {showPaygSettings && (
                <PaygSettingsDrawer
                    onClose={() => setShowPaygSettings(false)}
                    showToast={showToast}
                />
            )}


            {/* BOTTOM NAVIGATION (Shown ONLY in Operational Home) */}
            <OperationalBottomNav
                activeTab={activeTab}
                onSelectTab={setActiveTab}
            />
        </div>
    );
};
