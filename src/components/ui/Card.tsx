import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border p-6',
          // Light mode - normal card
          'bg-card border-border',
          // Dark mode - glassmorphism effect
          'dark:bg-gradient-to-br dark:from-white/[0.03] dark:to-white/[0.01] dark:backdrop-blur-md',
          'dark:border-white/8',
          'dark:shadow-lg dark:shadow-black/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

