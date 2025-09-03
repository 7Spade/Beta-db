/**
 * @fileoverview 專案編輯彈窗組件
 */
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Engagement } from '../../types';
import { EditEngagementForm } from '../forms';

interface EngagementDialogProps {
    engagement: Engagement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (engagementId: string) => void;
}

export function EngagementDialog({
    engagement,
    open,
    onOpenChange,
    onSuccess
}: EngagementDialogProps) {
    const handleSuccess = (engagementId: string) => {
        onSuccess?.(engagementId);
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {engagement ? '編輯專案' : '創建專案'}
                    </DialogTitle>
                    <DialogDescription>
                        {engagement ? '修改專案資訊' : '填寫新專案的基本資訊'}
                    </DialogDescription>
                </DialogHeader>

                <EditEngagementForm
                    engagement={engagement}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    );
}
