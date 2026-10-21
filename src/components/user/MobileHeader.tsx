import React from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../../assets/BrandLogo.jpeg';
interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
}) => {
  const {
    unreadNotificationCount,
    setIsNotificationsOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 h-14 flex items-center justify-between">
      {/* Left Slot: Back button or Brand */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#111827] active:bg-[#F3F4F6] transition-colors"
            aria-label="Go back"
          >
            <i className="fa-solid fa-arrow-left text-base"></i>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={BrandLogo}
              alt="FlexiMeal logo"
              className="w-7 h-7 object-contain rounded-full"
            />
            <span className="font-heading font-bold text-lg tracking-tight text-[#111827]">
              Flexi<span className="text-[#DC2626]">Meal</span>
            </span>
          </div>
        )}

        {title && showBack && (
          <h1 className="font-heading font-semibold text-base text-[#111827] truncate max-w-[190px]">
            {title}
          </h1>
        )}
      </div>

      {/* Right Slot: Scenario Switcher + Notification Bell */}
      <div className="flex items-center gap-1.5">
        {/* Notifications Icon with Badge */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#4B5563] active:bg-[#F3F4F6] relative transition-colors"
          aria-label="Notifications"
        >
          <i className="fa-regular fa-bell text-base"></i>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
