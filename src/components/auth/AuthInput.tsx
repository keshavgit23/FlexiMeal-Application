import React, { useId } from 'react';

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function AuthInput({
  id: explicitId,
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  disabled,
  required,
  className = '',
  ...props
}: AuthInputProps) {
  const generatedId = useId();
  const inputId = explicitId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

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
      </div>

      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-[#9CA3AF]">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            w-full h-12 rounded-xl text-sm font-normal text-[#111827] bg-[#FFFFFF]
            border transition-all duration-150 outline-none
            placeholder:text-[#9CA3AF]
            ${startIcon ? 'pl-11' : 'pl-3.5'}
            ${endIcon ? 'pr-11' : 'pr-3.5'}
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

        {endIcon && (
          <div className="absolute right-3.5 flex items-center justify-center text-[#6B7280]">
            {endIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-[#991B1B] mt-0.5" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[#6B7280] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}