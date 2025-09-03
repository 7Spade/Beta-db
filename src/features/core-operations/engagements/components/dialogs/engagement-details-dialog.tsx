/**
 * @fileoverview 專案詳細信息彈窗組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Engagement } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface EngagementDetailsDialogProps {
    engagement: Engagement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EngagementDetailsDialog({
    engagement,
    open,
    onOpenChange
}: EngagementDetailsDialogProps) {
    if (!engagement) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{engagement.name}</DialogTitle>
                    <DialogDescription>
                        {engagement.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 基本資訊 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">基本資訊</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium">客戶:</span>
                                    <p className="text-sm text-muted-foreground">{engagement.client}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">承包商:</span>
                                    <p className="text-sm text-muted-foreground">{engagement.contractor}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">開始日期:</span>
                                    <p className="text-sm text-muted-foreground">{formatDate(engagement.startDate)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">結束日期:</span>
                                    <p className="text-sm text-muted-foreground">{formatDate(engagement.endDate)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 狀態資訊 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">狀態資訊</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-4">
                                <div>
                                    <span className="text-sm font-medium">狀態:</span>
                                    <Badge variant="outline" className="ml-2">{engagement.status}</Badge>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">階段:</span>
                                    <Badge variant="outline" className="ml-2">{engagement.phase}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 財務資訊 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">財務資訊</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <span className="text-sm font-medium">總價值:</span>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(engagement.totalValue, engagement.currency)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">已付款:</span>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(engagement.paidAmount, engagement.currency)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">待付款:</span>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(engagement.pendingAmount, engagement.currency)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
