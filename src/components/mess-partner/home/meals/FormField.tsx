import React from 'react';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  helperText,
  required,
  className = '',
  children,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-red-500 font-bold">*</span>}
          </label>
        </div>
      )}

      {children}

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5 animate-fadeIn"
        >
          <i className="fa-solid fa-circle-exclamation text-[11px] shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
