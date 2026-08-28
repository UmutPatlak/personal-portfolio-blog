import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default:
      'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
    accent:
      'bg-[var(--color-accent)]/10 text-[var(--color-accent-hover)] border border-[var(--color-accent)]/20',
    success:
      'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)] border border-[var(--color-accent-emerald)]/20',
    outline:
      'border border-[var(--color-border)] text-[var(--color-text-tertiary)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
