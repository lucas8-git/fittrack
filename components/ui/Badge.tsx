'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variants = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}
