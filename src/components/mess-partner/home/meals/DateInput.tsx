import React, { useRef } from 'react';
import FormField from './FormField';

export interface DateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  min,
  max,
  disabled,
  className = '',
}) => {
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // Format value into readable representation, e.g. "25 Sep 2026"
  const formattedDisplay = React.useMemo(() => {
    if (!value) return 'Select date';
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return value;
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) return value;
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [value]);

  const handleContainerClick = () => {
    if (disabled) return;
    if (nativeInputRef.current) {
      if (typeof nativeInputRef.current.showPicker === 'function') {
        try {
          nativeInputRef.current.showPicker();
          return;
        } catch {
          // Fallback
        }
      }
      nativeInputRef.current.focus();
    }
  };

  const setRelativeDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <FormField
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <div className="flex flex-col gap-1.5">
        <div
          onClick={handleContainerClick}
          className={`relative flex items-center justify-between w-full min-h-[46px] px-3.5 bg-white border rounded-xl cursor-pointer select-none transition-all duration-150 ${
            error
              ? 'border-red-400 bg-red-50/20 ring-1 ring-red-200'
              : 'border-gray-200 hover:border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 shadow-sm'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <i className="fa-regular fa-calendar-days text-sm" aria-hidden="true" />
            </span>
            <div className="flex flex-col text-left">
              <span className={`text-sm font-semibold ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                {formattedDisplay}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-emerald-700 font-medium px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors">
              Change
            </span>
          </div>

          {/* Hidden but accessible native date input */}
          <input
            ref={nativeInputRef}
            type="date"
            value={value}
            min={min}
            max={max}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label={label || 'Select Date'}
          />
        </div>

        {/* Quick shortcut pills */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setRelativeDate(0)}
            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setRelativeDate(1)}
            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            Tomorrow
          </button>
        </div>
      </div>
    </FormField>
  );
};

export default DateInput;
