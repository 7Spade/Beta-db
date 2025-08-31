'use client';

import { cn } from '@/utils';
import * as React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, className, size = 'md', ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
    };

    const iconSizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && (
          <div
            className={cn('text-muted-foreground mb-4', iconSizeClasses[size])}
          >
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}

        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
