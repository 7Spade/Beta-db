'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import * as React from 'react';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

const ModalContainer = React.forwardRef<HTMLDivElement, ModalContainerProps>(
  (
    {
      isOpen,
      onClose,
      children,
      className,
      size = 'md',
      title,
      description,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={ref}
          className={`${sizeClasses[size]} ${className || ''}`}
          {...props}
        >
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);
ModalContainer.displayName = 'ModalContainer';

export { ModalContainer };

