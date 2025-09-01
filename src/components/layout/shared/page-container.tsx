'use client';

import { Card, CardContent, CardHeader } from '@/ui/card';
import { cn } from '@root/src/shared/utils';
import * as React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
  variant?: 'default' | 'card';
  title?: string;
  description?: string;
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      children,
      className,
      maxWidth = 'xl',
      padding = 'md',
      centered = true,
      variant = 'default',
      title,
      description,
      ...props
    },
    ref
  ) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full',
    };

    const paddingClasses = {
      none: '',
      sm: 'px-4 py-2',
      md: 'px-6 py-4',
      lg: 'px-8 py-6',
    };

    const containerClasses = cn(
      'w-full',
      maxWidth !== 'full' && maxWidthClasses[maxWidth],
      centered && 'mx-auto',
      variant === 'default' && paddingClasses[padding],
      className
    );

    if (variant === 'card') {
      return (
        <Card ref={ref} className={containerClasses} {...props}>
          {(title || description) && (
            <CardHeader>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </CardHeader>
          )}
          <CardContent className={paddingClasses[padding]}>
            {children}
          </CardContent>
        </Card>
      );
    }

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);
PageContainer.displayName = 'PageContainer';

export { PageContainer };

