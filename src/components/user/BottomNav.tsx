import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedMessId, meals } = useApp();

  // Check if today has pending action
  const hasPendingTodayMeal = meals.some(
    (m) => m.displayDate === 'Today' && m.status === 'unresponded'
  );

  const tabs: Array<{
    id: 'home' | 'discover' | 'meals' | 'more';
    label: string;
    icon: string;
    hasBadge?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'discover', label: 'Discover', icon: 'fa-solid fa-compass' },
    { id: 'meals', label: 'Meals', icon: 'fa-solid fa-calendar-check', hasBadge: hasPendingTodayMeal },
    { id: 'more', label: 'More', icon: 'fa-solid fa-bars' },
  ];

  const handleTabClick = (tabId: 'home' | 'discover' | 'meals' | 'more') => {
    // If clicking discover or home from details view, reset mess detail view
    setSelectedMessId(null);
    setActiveTab(tabId);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E5E7EB] max-w-[430px] mx-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative tap-highlight ${
                isActive ? 'text-[#DC2626]' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <i className={`${tab.icon} text-lg ${isActive ? 'scale-105' : ''}`}></i>
                {tab.hasBadge && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-1 ring-white"></span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight whitespace-nowrap truncate max-w-[70px] ${
                  isActive ? 'font-semibold text-[#DC2626]' : ''
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-[#DC2626] rounded-full absolute bottom-1.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
