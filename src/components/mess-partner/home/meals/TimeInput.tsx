import React, { useRef } from 'react';
import FormField from './FormField';

export interface TimeInputProps {
  label?: string;
  value: string; // HH:mm format (24-hour)
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  placeholder = '--:--',
  className = '',
}) => {
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // Format HH:mm into friendly 12-hour string (e.g. 13:00 -> 1:00 PM)
  const formattedDisplay = React.useMemo(() => {
    if (!value) return placeholder;
    const parts = value.split(':');
    if (parts.length < 2) return value;
    const hours = parseInt(parts[0], 10);
    const mins = parts[1];
    if (isNaN(hours)) return value;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${mins} ${ampm}`;
  }, [value, placeholder]);

  const handleContainerClick = () => {
    if (disabled) return;
    if (nativeInputRef.current) {
      if (typeof nativeInputRef.current.showPicker === 'function') {
        try {
          nativeInputRef.current.showPicker();
          return;
        } catch {
          // Fallback to focus
        }
      }
      nativeInputRef.current.focus();
    }
  };

  return (
    <FormField
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <div
        onClick={handleContainerClick}
        className={`relative flex items-center justify-between w-full min-h-[46px] px-3.5 bg-white border rounded-xl cursor-pointer select-none transition-all duration-150 ${
          error
            ? 'border-red-400 bg-red-50/20 ring-1 ring-red-200'
            : 'border-gray-200 hover:border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 shadow-sm'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <i className="fa-regular fa-clock text-xs" aria-hidden="true" />
          </span>
          <span className={`text-sm font-semibold tabular-nums ${value ? 'text-gray-900' : 'text-gray-400'}`}>
            {formattedDisplay}
          </span>
        </div>

        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
          {value ? 'Set' : 'Select'}
        </span>

        {/* Hidden but accessible native time input */}
        <input
          ref={nativeInputRef}
          type="time"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-label={label || 'Select Time'}
        />
      </div>
    </FormField>
  );
};

export default TimeInput;
