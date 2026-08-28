import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300',
        hover && 'hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]',
        glow && 'animate-pulse-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
