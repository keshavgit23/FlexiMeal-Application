import React from 'react';

interface PhoneFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  id,
  value,
  onChange,
  error,
  label = 'Phone Number',
  placeholder = '9876543210',
  helperText = 'Used for meal booking alerts & mess communication',
  disabled = false,
}) => {
  const handleChange = (inputValue: string) => {
    const sanitizedValue = inputValue.replace(/\D/g, '').slice(0, 10);
    onChange(sanitizedValue);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5"
        style={{ fontFamily: 'var(--font-family-body)' }}
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <span
          className="absolute left-3.5 text-[var(--color-text-disabled)] pointer-events-none text-sm"
          aria-hidden="true"
        >
          <i className="fa-solid fa-phone"></i>
        </span>

        <span
          className="absolute left-9 text-sm font-medium text-[var(--color-text-secondary)] pointer-events-none border-r border-[var(--color-border-subtle)] pr-2"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          +91
        </span>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={10}
          className={`w-full pl-22 pr-4 py-3 min-h-[48px] text-sm text-[var(--color-text-primary)] bg-[var(--color-surface)] border rounded-xl placeholder-[var(--color-text-disabled)] focus:outline-none transition-colors ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-[var(--color-border)] focus:border-[var(--color-border-focus)]'
          } ${disabled ? 'bg-[#F9FAFB] cursor-not-allowed' : ''}`}
          style={{ fontFamily: 'var(--font-family-body)' }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-[11px] text-red-500 mt-1 pl-1"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${id}-help`}
          className="text-[11px] text-[var(--color-text-disabled)] mt-1 pl-1"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};