function SpinnerIcon({ className = 'w-5 h-5 animate-spin' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}


export interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function AuthButton({
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  disabled,
  children,
  className = '',
  type = 'button',
  ...props
}: AuthButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold text-sm rounded-xl transition-all duration-150 select-none min-h-[48px] h-12 px-5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-[#DC2626] hover:bg-[#EF4444] active:bg-[#B91C1C] text-[#FFFFFF] shadow-sm hover:shadow-md focus-visible:ring-[#DC2626]',
    secondary:
      'bg-[#FF6B00] hover:bg-[#F97316] text-[#FFFFFF] shadow-sm focus-visible:ring-[#FF6B00]',
    outline:
      'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] active:bg-[#F3F4F6] focus-visible:ring-[#DC2626]',
    ghost:
      'bg-transparent text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] active:bg-[#E5E7EB] focus-visible:ring-[#DC2626]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <SpinnerIcon className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
