'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover';
import * as React from 'react';

interface PopoverContainerProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const PopoverContainer = React.forwardRef<
  HTMLDivElement,
  PopoverContainerProps
>(
  (
    {
      children,
      content,
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      alignOffset = 0,
      open,
      onOpenChange,
      trigger,
      ...props
    },
    ref
  ) => {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {trigger || children}
        </PopoverTrigger>
        <PopoverContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={className}
          {...props}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }
);
PopoverContainer.displayName = 'PopoverContainer';

export { PopoverContainer };

