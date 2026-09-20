import React, { useEffect, useRef, useState } from 'react';

/**
 * ============================================================================
 * REUSABLE DROPDOWN — CustomDropdown
 * ============================================================================
 * Matches the visual style of the College Name input in CollegeForm:
 *   - Same border treatment (width + color, not color alone)
 *   - Same chevron icon system (Font Awesome webfont glyph, not the
 *     FontAwesomeIcon SVG component) so icon sizing matches exactly
 *   - Click-outside-to-close behavior
 * ============================================================================
 */

export interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  id: string;
  label?: string;
  value: string;
  placeholder?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon?: string; // e.g. "fa-solid fa-location-dot"
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  label,
  value,
  placeholder = 'Select an option',
  options,
  onChange,
  icon,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#374151] mb-1.5"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-sm text-left bg-white border transition-colors flex items-center ${
          icon ? 'pl-10' : ''
        } ${isOpen ? 'border-[#FF6B00]' : 'border-[#D1D5DB]'} ${
          disabled ? 'bg-[#F9FAFB] cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ fontFamily: 'var(--font-family-body)' }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && (
          <span
            className="absolute left-3.5 text-[#9CA3AF] pointer-events-none text-sm"
            aria-hidden="true"
          >
            <i className={icon}></i>
          </span>
        )}

        <span
          className={`flex-1 truncate ${
            selectedOption ? 'text-[#111827]' : 'text-[#9CA3AF]'
          }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <span
          className={`text-[#9CA3AF] text-xs transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <i className="fa-solid fa-chevron-down"></i>
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 mb-0 bottom-full md:top-full md:bottom-auto mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#FFF7ED] text-[#FF6B00]'
                    : 'text-[#374151] hover:bg-[#FFF7ED] hover:text-[#FF6B00]'
                }`}
              >
                <span className="truncate">{option.label}</span>

                {isSelected && (
                  <i className="fa-solid fa-chevron-down text-[10px] ml-auto"></i>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};