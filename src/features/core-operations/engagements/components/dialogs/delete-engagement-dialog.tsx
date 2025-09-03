/**
 * @fileoverview 刪除專案確認彈窗組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteEngagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    engagementName?: string;
}

export function DeleteEngagementDialog({
    open,
    onOpenChange,
    onConfirm,
    engagementName = "此專案"
}: DeleteEngagementDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <DialogTitle>確認刪除</DialogTitle>
                    </div>
                    <DialogDescription>
                        您確定要刪除 <strong>{engagementName}</strong> 嗎？此操作無法復原。
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        取消
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        確認刪除
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
