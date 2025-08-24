'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// 基礎日期選擇器組件
interface DatePickerProps {
  field: ControllerRenderProps<any, any>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ 
  field, 
  placeholder = "選擇一個日期",
  className,
  disabled = false
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            disabled={disabled}
          >
            {field.value ? (
              format(field.value, 'PPP')
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

// 日期範圍選擇器組件
interface DateRangePickerProps {
  startField: ControllerRenderProps<any, any>;
  endField: ControllerRenderProps<any, any>;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({ 
  startField, 
  endField, 
  startPlaceholder = "起始日期",
  endPlaceholder = "結束日期",
  className,
  disabled = false
}: DateRangePickerProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">{startPlaceholder}</label>
        <DatePicker 
          field={startField} 
          placeholder={startPlaceholder}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">{endPlaceholder}</label>
        <DatePicker 
          field={endField} 
          placeholder={endPlaceholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

// 表單日期欄位組件（與 react-hook-form 整合）
interface FormDateFieldProps {
  field: ControllerRenderProps<any, any>;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormDateField({ 
  field, 
  label, 
  placeholder,
  className,
  disabled = false
}: FormDateFieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label className="text-sm font-medium mb-2">{label}</label>
      <DatePicker 
        field={field} 
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

// 表單日期範圍欄位組件
interface FormDateRangeFieldProps {
  startField: ControllerRenderProps<any, any>;
  endField: ControllerRenderProps<any, any>;
  startLabel?: string;
  endLabel?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormDateRangeField({ 
  startField, 
  endField, 
  startLabel = "起始日期",
  endLabel = "結束日期",
  startPlaceholder = "選擇起始日期",
  endPlaceholder = "選擇結束日期",
  className,
  disabled = false
}: FormDateRangeFieldProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <FormDateField 
        field={startField} 
        label={startLabel}
        placeholder={startPlaceholder}
        disabled={disabled}
      />
      <FormDateField 
        field={endField} 
        label={endLabel}
        placeholder={endPlaceholder}
        disabled={disabled}
      />
    </div>
  );
}

// 日期格式化工具函數
export const dateUtils = {
  format: (date: Date, formatStr: string = 'PPP') => format(date, formatStr),
  formatShort: (date: Date) => format(date, 'MM/dd/yyyy'),
  formatLong: (date: Date) => format(date, 'PPP'),
  formatTime: (date: Date) => format(date, 'PPp'),
  isValid: (date: any): date is Date => date instanceof Date && !isNaN(date.getTime()),
  isFuture: (date: Date) => date > new Date(),
  isPast: (date: Date) => date < new Date(),
  isToday: (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
};
