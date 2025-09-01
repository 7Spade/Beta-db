'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/ui/sheet';
import * as React from 'react';

interface DrawerContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
}

const DrawerContainer = React.forwardRef<HTMLDivElement, DrawerContainerProps>(
  (
    {
      isOpen,
      onClose,
      children,
      className,
      side = 'right',
      size = 'md',
      title,
      description,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-[28rem]',
      full: 'w-full',
    };

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          ref={ref}
          side={side}
          className={`${sizeClasses[size]} ${className || ''}`}
          {...props}
        >
          {(title || description) && (
            <SheetHeader>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}
          {children}
        </SheetContent>
      </Sheet>
    );
  }
);
DrawerContainer.displayName = 'DrawerContainer';

export { DrawerContainer };

