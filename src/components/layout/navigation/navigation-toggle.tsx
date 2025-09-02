/**
 * @fileoverview 導航群組顯示切換組件
 * @description 提供導航群組的顯示/隱藏切換功能
 */
'use client';

import { Button } from '@/ui/button';
import { Switch } from '@/ui/switch';
import { cn } from '@root/src/shared/utils';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { useState } from 'react';

export interface NavigationToggleProps {
    groupId: string;
    groupLabel: string;
    isVisible: boolean;
    onToggle: (groupId: string, isVisible: boolean) => void;
    className?: string;
    variant?: 'switch' | 'button' | 'icon';
}

export function NavigationToggle({
    groupId,
    groupLabel,
    isVisible,
    onToggle,
    className,
    variant = 'switch',
}: NavigationToggleProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleToggle = () => {
        onToggle(groupId, !isVisible);
    };

    if (variant === 'switch') {
        return (
            <div
                className={cn(
                    'flex items-center justify-between gap-2 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors',
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span className="text-sm font-medium text-foreground/80">
                    {groupLabel}
                </span>
                <Switch
                    checked={isVisible}
                    onCheckedChange={handleToggle}
                    className="data-[state=checked]:bg-primary"
                />
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <Button
                variant={isVisible ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggle}
                className={cn(
                    'flex items-center gap-2 transition-all duration-200',
                    isVisible
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-dashed hover:border-primary/50',
                    className
                )}
            >
                {isVisible ? (
                    <>
                        <Eye className="h-4 w-4" />
                        <span>顯示</span>
                    </>
                ) : (
                    <>
                        <EyeOff className="h-4 w-4" />
                        <span>隱藏</span>
                    </>
                )}
            </Button>
        );
    }

    if (variant === 'icon') {
        return (
            <div
                onClick={handleToggle}
                className={cn(
                    'h-6 w-6 p-0 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer hover:bg-accent',
                    isVisible
                        ? 'text-primary hover:text-primary/80'
                        : 'text-muted-foreground hover:text-foreground',
                    className
                )}
                title={`${isVisible ? '隱藏' : '顯示'} ${groupLabel}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
            >
                {isVisible ? (
                    <Eye className="h-4 w-4" />
                ) : (
                    <EyeOff className="h-4 w-4" />
                )}
            </div>
        );
    }

    return null;
}

// 導航群組設置面板組件
export interface NavigationSettingsPanelProps {
    groups: Array<{
        id: string;
        label: string;
        isVisible: boolean;
    }>;
    onToggleGroup: (groupId: string, isVisible: boolean) => void;
    onResetToDefault?: () => void;
    className?: string;
}

export function NavigationSettingsPanel({
    groups,
    onToggleGroup,
    onResetToDefault,
    className,
}: NavigationSettingsPanelProps) {
    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">導航設置</h3>
                {onResetToDefault && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetToDefault}
                        className="flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        重置為默認
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                {groups.map((group) => (
                    <NavigationToggle
                        key={group.id}
                        groupId={group.id}
                        groupLabel={group.label}
                        isVisible={group.isVisible}
                        onToggle={onToggleGroup}
                        variant="switch"
                    />
                ))}
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
                調整導航群組的顯示狀態，設置將自動保存
            </div>
        </div>
    );
}
