import React, { useState } from 'react';
import type {
    MessOwnerData,
    OperationalStatusMode,
    OperationalTab,
    ShiftData,
} from '../../../types/messOnboarding';
import { INITIAL_SHIFT_DATA } from '../../../mockData';
import { StatusBadge } from '../shared/StatusBadge';
import { ShiftHero } from './ShiftHero';
import { MenuSection } from './MenuSection';
import { NextShift } from './NextShift';
import { ListingStatus } from './ListingStatus';
import { OperationalBottomNav } from './OperationalBottomNav';
import { EmptyState, ErrorState, SuccessState } from '../shared/StateView';

export interface OperationalHomeProps {
    messData: MessOwnerData;
    onEditProfile: () => void;
    onPreviewStudentView: () => void;
}

export const OperationalHome: React.FC<OperationalHomeProps> = ({
    messData,
    onEditProfile,
    onPreviewStudentView,
}) => {
    const [activeTab, setActiveTab] = useState<OperationalTab>('shift');
    const [operationalMode, setOperationalMode] =
        useState<OperationalStatusMode>('NORMAL');
    const [shiftData, setShiftData] = useState<ShiftData>(INITIAL_SHIFT_DATA);

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
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-1.5 text-[11px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                        Simulate State:
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setOperationalMode('NORMAL')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${operationalMode === 'NORMAL'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Active Shift
                        </button>
                        <button
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
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full pb-8">
                {/* TAB 1: SHIFT (KITCHEN OPERATIONS) */}
                {activeTab === 'shift' && (
                    <>
                        {operationalMode === 'NORMAL' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* HERO: CURRENT SHIFT + 185 MEALS TO PREPARE */}
                                <ShiftHero shift={shiftData} />

                                {/* MENU TO COOK */}
                                <MenuSection initialMenuItems={shiftData.menuToCook} />

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

                        {/* EMPTY STATE: NO MEAL SCHEDULED */}
                        {operationalMode === 'EMPTY' && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                <EmptyState
                                    icon="fa-solid fa-calendar-xmark"
                                    title="No meal scheduled yet"
                                    description="Create today's meal to start managing kitchen demand and receive student headcounts."
                                    primaryAction={{
                                        label: 'Add Today\'s Meal',
                                        onClick: () => setOperationalMode('NORMAL'),
                                        variant: 'primary',
                                    }}
                                    secondaryAction={{
                                        label: 'Restore sample shift',
                                        onClick: () => setOperationalMode('NORMAL'),
                                    }}
                                />
                            </div>
                        )}

                        {/* COMPLETED STATE: SHIFT COMPLETED */}
                        {operationalMode === 'COMPLETED' && (
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
                        )}

                        {/* ERROR STATE: UNABLE TO LOAD KITCHEN DATA */}
                        {operationalMode === 'ERROR' && (
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
                        )}
                    </>
                )}

                {/* TAB 2: SCHEDULE */}
                {activeTab === 'schedule' && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black font-heading text-gray-900">
                                    Weekly Meal Schedule
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Manage fixed rotating dishes for students
                                </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                This Week
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                {
                                    day: 'Monday',
                                    lunch: 'Chole Masala, Jeera Rice, Phulka',
                                    dinner: 'Aloo Gobi, Dal Fry, Chapati',
                                },
                                {
                                    day: 'Tuesday',
                                    lunch: 'Rajma Rasila, Steamed Rice, Chapati',
                                    dinner: 'Veg Biryani, Boondi Raita',
                                },
                                {
                                    day: 'Wednesday (Today)',
                                    lunch: 'Paneer Butter Masala, Dal Tadka, Rice',
                                    dinner: 'Sev Tamatar, Methi Thepla',
                                    isToday: true,
                                },
                                {
                                    day: 'Thursday',
                                    lunch: 'Baingan Bharta, Dal Makhani, Rice',
                                    dinner: 'Mix Veg, Phulka, Khichdi',
                                },
                                {
                                    day: 'Friday',
                                    lunch: 'Kadhi Pakora, Jeera Rice, Chapati',
                                    dinner: 'Palak Paneer, Tawa Roti',
                                },
                                {
                                    day: 'Saturday',
                                    lunch: 'Pav Bhaji Feast / Special Thali',
                                    dinner: 'Pulao, Dal Fry, Papad',
                                },
                                {
                                    day: 'Sunday',
                                    lunch: 'Special Sunday Feast (Kheer / Sweet)',
                                    dinner: 'Light Dinner (Dal Khichdi)',
                                },
                            ].map((item) => (
                                <div
                                    key={item.day}
                                    className={`p-3 rounded-xl border text-xs ${item.isToday
                                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500'
                                        : 'bg-stone-50 border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between font-bold text-gray-900 font-heading mb-1">
                                        <span>{item.day}</span>
                                        {item.isToday && (
                                            <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded">
                                                Active Today
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="font-semibold text-gray-800">Lunch:</span>{' '}
                                        {item.lunch}
                                    </div>
                                    <div className="text-gray-600 mt-0.5">
                                        <span className="font-semibold text-gray-800">Dinner:</span>{' '}
                                        {item.dinner}
                                    </div>
                                </div>
                            ))}
                        </div>
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

                            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">
                                        PWA Offline Sync
                                    </div>
                                    <div className="text-gray-500 text-[11px]">
                                        Keep shift count active without internet
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* BOTTOM NAVIGATION (Shown ONLY in Operational Home) */}
            <OperationalBottomNav
                activeTab={activeTab}
                onSelectTab={setActiveTab}
            />
        </div>
    );
};
