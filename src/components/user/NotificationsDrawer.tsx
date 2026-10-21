import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
      <div
        className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3"></div>

        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              Notifications
            </h2>
            <span className="text-[11px] font-semibold text-[#6B7280]">
              ({notifications.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-semibold text-[#DC2626] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B7280]">
              <i className="fa-regular fa-bell-slash text-2xl text-[#9CA3AF] mb-2 block"></i>
              No notifications right now
            </div>
          ) : (
            notifications.map((notif) => {
              const iconMap = {
                cutoff: 'fa-regular fa-clock text-[#FF6B00] bg-[#FFF7ED]',
                default_applied: 'fa-solid fa-clock-rotate-left text-[#D97706] bg-[#FEF3C7]',
                payment: 'fa-solid fa-receipt text-[#2563EB] bg-[#EFF6FF]',
                subscription: 'fa-solid fa-calendar-check text-[#16A34A] bg-[#ECFDF5]',
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.type === 'cutoff') {
                      setIsNotificationsOpen(false);
                      setActiveTab('home');
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !notif.read
                      ? 'bg-white border-[#DC2626]/30 shadow-xs'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] opacity-90'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                      iconMap[notif.type] || 'fa-regular fa-bell text-[#6B7280] bg-[#F3F4F6]'
                    }`}
                  >
                    <i className={iconMap[notif.type].split(' ')[0] + ' ' + iconMap[notif.type].split(' ')[1]}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-heading font-semibold text-xs text-[#111827] truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1"></span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
