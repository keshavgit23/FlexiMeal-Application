import FormField from './FormField';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
  badge?: string;
}

export interface SegmentedSelectProps<T extends string = string> {
  label?: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SegmentedSelect<T extends string = string>({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  className = '',
}: SegmentedSelectProps<T>) {
  return (
    <FormField
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <div
        role="radiogroup"
        aria-label={label || 'Select option'}
        className={`grid grid-cols-${options.length} gap-1.5 p-1 bg-gray-100/90 rounded-2xl border ${
          error ? 'border-red-300' : 'border-gray-200/80'
        }`}
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`min-h-[46px] px-2 py-2 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold tracking-tight transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 active:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {option.icon && (
                  <i
                    className={`${option.icon} text-xs transition-transform ${
                      isSelected ? 'scale-110 text-emerald-100' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span>{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

export default SegmentedSelect;
