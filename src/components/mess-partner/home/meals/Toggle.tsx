import React from 'react';

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  icon,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`group flex items-center justify-between p-3.5 min-h-[56px] rounded-2xl border transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        checked
          ? 'bg-emerald-50/50 border-emerald-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="flex items-center gap-3 pr-3">
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              checked ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <i className={icon} aria-hidden="true" />
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-900 group-hover:text-black">
            {label}
          </span>
          {description && (
            <span className="text-xs text-gray-500 mt-0.5 leading-tight">{description}</span>
          )}
        </div>
      </div>

      {/* Switch pill */}
      <div
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? 'bg-emerald-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export default Toggle;
