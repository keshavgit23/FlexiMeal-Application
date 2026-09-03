import React, { useState, useId } from 'react';

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
function EyeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  showForgotPassword?: boolean;
  onForgotPasswordClick?: () => void;
}
function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PasswordInput({
  id: explicitId,
  label = 'Password',
  showForgotPassword = true,
  onForgotPasswordClick,
  disabled,
  error,
  className = '',
  required,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = explicitId || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#111827] tracking-tight flex items-center gap-1"
          style={{ fontFamily: 'var(--font-family-body, inherit)' }}
        >
          <span>{label}</span>
          {required && <span className="text-[#DC2626]" aria-hidden="true">*</span>}
        </label>

        {showForgotPassword && (
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] transition-colors focus:outline-none focus:underline active:opacity-75 py-0.5"
            style={{ fontFamily: 'var(--font-family-body, inherit)' }}
          >
            Forgot password?
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-[#9CA3AF]">
          <LockIcon className="w-5 h-5" />
        </div>

        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          className={`
            w-full h-12 rounded-xl text-sm font-normal text-[#111827] bg-[#FFFFFF]
            border pl-11 pr-12 transition-all duration-150 outline-none
            placeholder:text-[#9CA3AF]
            ${
              error
                ? 'border-[#991B1B] bg-[#FEF2F2] focus:ring-2 focus:ring-[#991B1B]/20 focus:border-[#991B1B]'
                : 'border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15'
            }
            ${disabled ? 'opacity-60 bg-[#F9FAFB] cursor-not-allowed text-[#9CA3AF]' : ''}
            ${className}
          `}
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 h-9 w-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
        >
          {showPassword ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-[#991B1B] mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
