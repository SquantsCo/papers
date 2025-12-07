'use client';

import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean;
}

export function ResponsiveContainer({
  children,
  maxWidth = 'lg',
  padding = true,
}: ResponsiveContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }[maxWidth];

  return (
    <div
      className={`mx-auto w-full ${maxWidthClass} ${
        padding ? 'px-4 sm:px-6 lg:px-8' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gapClass = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }[gap];

  return (
    <div
      className={`grid grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} ${gapClass}`}
    >
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveStack({
  children,
  direction = 'vertical',
  gap = 'md',
}: ResponsiveStackProps) {
  const gapClass = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }[gap];

  const directionClass =
    direction === 'vertical'
      ? 'flex flex-col'
      : 'flex flex-col sm:flex-row';

  return (
    <div className={`${directionClass} ${gapClass}`}>
      {children}
    </div>
  );
}

interface ResponsiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const ResponsiveButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const variantClass = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-900',
    }[variant];

    const sizeClass = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }[size];

    return (
      <button
        ref={ref}
        className={`
          font-semibold rounded-lg transition-colors
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClass} ${sizeClass}
          ${fullWidth ? 'w-full' : ''}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';

interface ResponsiveCardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: boolean;
}

export function ResponsiveCard({
  children,
  hover = true,
  padding = true,
}: ResponsiveCardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        ${padding ? 'p-4 sm:p-6' : ''}
        ${hover ? 'hover:shadow-lg transition-shadow' : 'shadow'}
      `}
    >
      {children}
    </div>
  );
}
