import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-3.5 min-h-[38px] gap-1.5',
    md: 'text-sm px-4 min-h-[44px] gap-2',
    lg: 'text-base px-5 min-h-[48px] gap-2.5 font-semibold shadow-sm',
  }[size];

  const variantClasses = {
    primary:
      'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm border border-emerald-800/20',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 border border-gray-200',
    outline:
      'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0 items-center justify-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 items-center justify-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
