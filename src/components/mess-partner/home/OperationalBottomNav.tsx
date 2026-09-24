import React from 'react';
import type { OperationalTab } from '../../../types/messOnboarding';

export interface OperationalBottomNavProps {
  activeTab: OperationalTab;
  onSelectTab: (tab: OperationalTab) => void;
}

const NAV_ITEMS: { id: OperationalTab; label: string; icon: string }[] = [
  { id: 'shift', label: 'Shift', icon: 'fa-solid fa-utensils' },
  { id: 'schedule', label: 'Schedule', icon: 'fa-solid fa-calendar-days' },
  { id: 'listing', label: 'Listing', icon: 'fa-solid fa-store' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

export const OperationalBottomNav: React.FC<OperationalBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-1.5 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      aria-label="Operational navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-h-[48px] py-1.5 flex flex-col items-center justify-center gap-1 transition rounded-xl relative ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-full flex items-center justify-center text-sm transition ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : ''
                }`}
              >
                <i className={item.icon} />
              </div>
              <span className="text-[11px] leading-none font-heading">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-emerald-700 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
