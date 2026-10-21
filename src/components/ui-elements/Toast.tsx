import React, { useEffect } from 'react';
import type { ToastProps, ToastType } from '../../types/ui-elements/toast';

interface TypeConfig {
  iconClass: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  iconColor: string;
  role: 'status' | 'alert';
  ariaLive: 'polite' | 'assertive';
}

const TOAST_CONFIG: Record<ToastType, TypeConfig> = {
  success: {
    iconClass: 'fa-solid fa-circle-check',
    bgColor: 'var(--color-success-bg)',
    borderColor: 'var(--color-success-border)',
    accentColor: 'var(--color-success)',
    iconColor: 'var(--color-success)',
    role: 'status',
    ariaLive: 'polite',
  },
  error: {
    iconClass: 'fa-solid fa-circle-exclamation',
    bgColor: 'var(--color-error-bg)',
    borderColor: 'var(--color-error-border)',
    accentColor: 'var(--color-error)',
    iconColor: 'var(--color-error)',
    role: 'alert',
    ariaLive: 'assertive',
  },
  warning: {
    iconClass: 'fa-solid fa-triangle-exclamation',
    bgColor: 'var(--color-warning-bg)',
    borderColor: 'var(--color-warning-border, var(--primitive-amber-300))',
    accentColor: 'var(--color-warning)',
    iconColor: 'var(--color-warning)',
    role: 'alert',
    ariaLive: 'assertive',
  },
  info: {
    iconClass: 'fa-solid fa-circle-info',
    bgColor: 'var(--color-info-bg)',
    borderColor: 'var(--color-info-border)',
    accentColor: 'var(--color-info)',
    iconColor: 'var(--color-info)',
    role: 'status',
    ariaLive: 'polite',
  },
};

/**
 * Reusable, accessible Toast notification component.
 * Uses Font Awesome icons and project-specific design system tokens.
 */
export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration,
  className = '',
}) => {
  const config = TOAST_CONFIG[type] ?? TOAST_CONFIG.info;

  // Optional auto-dismiss behavior when duration is provided and positive
  useEffect(() => {
    if (!duration || duration <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      aria-atomic="true"
      className={`animate-toast-in relative z-50 flex w-full max-w-sm sm:max-w-md items-start justify-between border text-left transition-all ${className}`.trim()}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        borderLeftColor: config.accentColor,
        borderLeftWidth: '4px',
        borderRadius: 'var(--radius-xl, 0.75rem)',
        boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
        padding: 'var(--space-3-5, 0.875rem) var(--space-4, 1rem)',
        gap: 'var(--space-3, 0.75rem)',
        fontFamily: 'var(--font-family-body, sans-serif)',
      }}
    >
      {/* Type Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center pt-0.5"
        style={{
          color: config.iconColor,
          fontSize: '1.125rem',
        }}
      >
        <i className={config.iconClass} aria-hidden="true" />
      </div>

      {/* Dynamic Message */}
      <div
        className="flex-1 break-words font-medium select-text"
        style={{
          color: 'var(--color-text-primary, #111827)',
          fontSize: 'var(--font-size-body-sm, 0.875rem)',
          lineHeight: 'var(--line-height-relaxed, 1.6)',
        }}
      >
        {message}
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="flex-shrink-0 inline-flex items-center justify-center p-1 cursor-pointer transition-colors duration-150 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          color: 'var(--color-text-secondary, #6B7280)',
          borderRadius: 'var(--radius-md, 0.375rem)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary, #111827)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary, #6B7280)';
        }}
      >
        <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
