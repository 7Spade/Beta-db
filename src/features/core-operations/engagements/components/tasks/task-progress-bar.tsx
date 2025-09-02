/**
 * @fileoverview 任務進度條組件
 */
'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from "@root/src/shared/utils"

interface TaskProgressBarProps {
    completed: number;
    total: number;
    percentage?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function TaskProgressBar({
    completed,
    total,
    percentage,
    showLabel = true,
    size = 'md',
    className
}: TaskProgressBarProps) {
    const calculatedPercentage = percentage !== undefined ? percentage : (total > 0 ? (completed / total) * 100 : 0);
    const displayPercentage = Math.round(calculatedPercentage);

    const getProgressColor = (percentage: number) => {
        if (percentage === 0) return 'bg-gray-200';
        if (percentage < 30) return 'bg-red-500';
        if (percentage < 60) return 'bg-yellow-500';
        if (percentage < 90) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
        switch (size) {
            case 'sm':
                return 'h-2';
            case 'md':
                return 'h-3';
            case 'lg':
                return 'h-4';
            default:
                return 'h-3';
        }
    };

    return (
        <div className={cn('space-y-1', className)}>
            {showLabel && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">進度</span>
                    <span className="font-medium">
                        {completed} / {total} ({displayPercentage}%)
                    </span>
                </div>
            )}

            <div className="relative">
                <Progress
                    value={calculatedPercentage}
                    className={cn(getSizeClasses(size), 'overflow-hidden')}
                />
                <div
                    className={cn(
                        'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                        getProgressColor(calculatedPercentage),
                        getSizeClasses(size)
                    )}
                    style={{ width: `${Math.min(calculatedPercentage, 100)}%` }}
                />
            </div>

            {completed === total && total > 0 && (
                <div className="flex items-center justify-center text-xs text-green-600 font-medium">
                    ✓ 任務已完成
                </div>
            )}
        </div>
    );
}
