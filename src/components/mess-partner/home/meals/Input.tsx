import React, { forwardRef } from 'react';
import FormField from './FormField';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      leftIcon,
      rightIcon,
      id,
      className = '',
      containerClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <FormField
        label={label}
        htmlFor={inputId}
        error={error}
        helperText={helperText}
        required={required}
        className={containerClassName}
      >
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full min-h-[44px] px-3.5 ${leftIcon ? 'pl-10' : ''} ${
              rightIcon ? 'pr-10' : ''
            } text-sm font-medium text-gray-900 bg-white border rounded-xl transition-all duration-150 outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
              error
                ? 'border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                : 'border-gray-200 hover:border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-sm'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';

export default Input;
