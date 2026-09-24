import React from 'react';

export interface StateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface StateViewProps {
  type: 'empty' | 'error' | 'loading' | 'success';
  icon?: string; // Font Awesome class name, e.g. "fa-solid fa-utensils"
  title: string;
  description?: string;
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
  retryAction?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const StateView: React.FC<StateViewProps> = ({
  type,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  retryAction,
  isLoading,
  className = '',
}) => {
  // Determine default icon and color palette based on type
  let defaultIcon = 'fa-solid fa-circle-info';
  let iconBg = 'bg-gray-100 text-gray-700';

  if (type === 'empty') {
    defaultIcon = 'fa-solid fa-utensils';
    iconBg = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  } else if (type === 'error') {
    defaultIcon = 'fa-solid fa-triangle-exclamation';
    iconBg = 'bg-red-50 text-red-700 border border-red-100';
  } else if (type === 'loading') {
    defaultIcon = 'fa-solid fa-spinner fa-spin';
    iconBg = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  } else if (type === 'success') {
    defaultIcon = 'fa-solid fa-circle-check';
    iconBg = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  }

  const iconClass = icon || defaultIcon;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 my-auto min-h-[220px] ${className}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 ${iconBg}`}
        aria-hidden="true"
      >
        <i className={iconClass} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1.5 font-heading">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 max-w-[280px] leading-relaxed mb-5">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-[260px] gap-2.5 mt-1">
        {retryAction && (
          <button
            type="button"
            onClick={retryAction}
            disabled={isLoading}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <i className="fa-solid fa-rotate-right" />
            )}
            <span>Retry</span>
          </button>
        )}

        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || isLoading}
            className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
              primaryAction.variant === 'secondary'
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : primaryAction.variant === 'outline'
                ? 'border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin" />}
            <span>{primaryAction.label}</span>
          </button>
        )}

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className="w-full min-h-[44px] px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

// Convenience component wrappers
export const EmptyState: React.FC<Omit<StateViewProps, 'type'>> = (props) => (
  <StateView type="empty" {...props} />
);

export const ErrorState: React.FC<Omit<StateViewProps, 'type'>> = (props) => (
  <StateView type="error" {...props} />
);

export const LoadingState: React.FC<Omit<StateViewProps, 'type'>> = (props) => (
  <StateView type="loading" {...props} />
);

export const SuccessState: React.FC<Omit<StateViewProps, 'type'>> = (props) => (
  <StateView type="success" {...props} />
);

export const InlineError: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium text-red-700 mt-1.5 ${className}`}
      role="alert"
    >
      <i className="fa-solid fa-circle-exclamation text-red-600 text-sm" />
      <span>{message}</span>
    </div>
  );
};
