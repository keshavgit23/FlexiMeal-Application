import React, { useRef, useEffect } from 'react';

export interface MenuItemInputProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  error?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onEnterPress?: () => void;
  disabled?: boolean;
}

export const MenuItemInput: React.FC<MenuItemInputProps> = ({
  index,
  value,
  onChange,
  onRemove,
  error,
  placeholder = 'e.g. Dal Tadka, Jeera Rice',
  autoFocus = false,
  onEnterPress,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterPress?.();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className={`flex items-center gap-2 p-1.5 pl-3 bg-white border rounded-xl transition-all duration-150 ${
          error
            ? 'border-red-400 bg-red-50/20 ring-1 ring-red-200'
            : 'border-gray-200 hover:border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 shadow-sm'
        }`}
      >
        <span className="w-5 text-center text-xs font-semibold text-gray-400 tabular-nums select-none shrink-0">
          {index + 1}.
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={`Menu item ${index + 1}`}
          className="w-full min-h-[38px] text-sm font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
        />

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${value || `item ${index + 1}`}`}
          className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
        </button>
      </div>

      {error && (
        <span className="text-[11px] font-medium text-red-600 pl-8 flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation text-[10px]" aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
};

export default MenuItemInput;
