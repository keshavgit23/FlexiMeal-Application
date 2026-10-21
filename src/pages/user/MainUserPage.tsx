import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../../components/user/MobileHeader';
import { BottomNav } from '../../components/user/BottomNav';
import { HomeScreen } from './UserHomePage';
import { DiscoverScreen } from './DiscoverScreen';
import { MessDetailsScreen } from './MessDetailsScreen';
import { MealsScreen } from './MealsScreen';
import { MoreScreen } from './MoreScreen';
import { PAYGModal } from '../../components/user/PAYGModal';
import { PaymentModal } from '../../components/user/PaymentModal';
import { NotificationsDrawer } from '../../components/user/NotificationsDrawer';
import { ScenarioDrawer } from '../../components/user/ScenarioDrawer';

const MainUserPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedMessId,
    setSelectedMessId,
    isPaygModalOpen,
    setIsPaygModalOpen,
    selectedPaygMessId,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    pendingPaymentDetails,
  } = useApp();

  const [moreSection, setMoreSection] = useState<'menu' | 'subscriptions' | 'payments' | 'bookings'>('menu');
  return (
    <div className="min-h-screen bg-[#E5E7EB] flex justify-center selection:bg-[#DC2626]/20">
      {/* 390px to 430px Mobile PWA Container */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#FFFDF9] shadow-2xl flex flex-col relative overflow-x-hidden border-x border-[#D1D5DB]/50">
        {/* Mobile Top App Bar */}
        <MobileHeader
          title={selectedMessId ? 'Mess Details' : undefined}
          showBack={Boolean(selectedMessId)}
          onBack={() => setSelectedMessId(null)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {selectedMessId ? (
            <MessDetailsScreen messId={selectedMessId} />
          ) : activeTab === 'home' ? (
            <HomeScreen
              onViewSubscriptions={() => {
                setMoreSection('payments');
                setActiveTab('more');
              }}
            />
          ) : activeTab === 'discover' ? (
            <DiscoverScreen />
          ) : activeTab === 'meals' ? (
            <MealsScreen />
          ) : (
            <MoreScreen
              activeSection={moreSection}
              setActiveSection={setMoreSection}

            />
          )}
        </main>

        {/* Persistent Bottom Navigation (Hidden when deep in Mess Details to prioritize sticky CTA) */}
        {!selectedMessId && <BottomNav />}

        {/* PAYG Modal */}
        {isPaygModalOpen && (
          <PAYGModal
            initialMessId={selectedPaygMessId}
            onClose={() => setIsPaygModalOpen(false)}
          />
        )}

        {/* Payment Modal */}
        {/* Payment Modal */}
        {isPaymentModalOpen && pendingPaymentDetails && (
          <PaymentModal
            profileId={pendingPaymentDetails.profileId}
            messName={pendingPaymentDetails.messName}
            amount={pendingPaymentDetails.amount}
            mealType={pendingPaymentDetails.mealType}
            defaultResponse={pendingPaymentDetails.defaultResponse}
            onClose={() => setIsPaymentModalOpen(false)}
          />
        )}

        {/* Notifications Drawer */}
        <NotificationsDrawer />

        {/* Scenario Drawer (Section 27: Scenarios A to L) */}
        <ScenarioDrawer />
      </div>
    </div>
  );
};

export default MainUserPage;