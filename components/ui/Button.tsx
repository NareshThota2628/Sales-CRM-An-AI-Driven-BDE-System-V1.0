import React, { ButtonHTMLAttributes } from 'react';
import SpinnerIcon from '../icons/SpinnerIcon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  leftIcon?: React.ReactNode;
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  isLoading = false,
  variant = 'primary',
  leftIcon,
  size = 'md',
  ...props
}) => {
  const baseClasses = `
    flex justify-center items-center rounded-full shadow-lg text-sm font-bold
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-300 transform hover:scale-105
    disabled:cursor-not-allowed disabled:opacity-75 disabled:scale-100
  `;

  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-4 px-8',
  };

  const variantClasses = {
    primary: `
      bg-yellow-400 text-slate-900 hover:bg-yellow-500
      focus:ring-yellow-400
      shadow-yellow-400/30
    `,
    secondary: `
      bg-transparent text-slate-700
      border border-slate-300
      hover:bg-slate-100
      focus:ring-slate-400
      shadow-none
    `,
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <SpinnerIcon className="w-5 h-5" />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
