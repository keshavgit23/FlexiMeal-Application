import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/ui-elements/Toast';
import type { ToastType } from '../types/ui-elements/toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    duration: number;
  } | null>(null);

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration = 3000
  ) => {
    setToast({
      message,
      type,
      duration,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast && (
        <div className="fixed right-4 top-4 z-[9999]">
          <Toast
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={hideToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
