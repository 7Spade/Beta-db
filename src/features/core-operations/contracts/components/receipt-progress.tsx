/**
 * @fileoverview 收款進度組件
 */
'use client';

import type { Receipt } from '@/features/core-operations/contracts/types';
import { Progress } from '@/ui/progress';

interface ReceiptProgressProps {
  receipts: Receipt[];
  totalValue: number;
}

export function ReceiptProgress({
  receipts,
  totalValue,
}: ReceiptProgressProps) {
  const totalReceived = receipts
    .filter((r) => r.status === '已收款')
    .reduce((acc, r) => acc + r.amount, 0);

  const progressPercentage =
    totalValue > 0 ? (totalReceived / totalValue) * 100 : 0;

  return (
    <div className="pt-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">
          總收款金額: ${totalReceived.toLocaleString()}
        </span>
        <span className="text-sm font-medium">
          ${totalValue.toLocaleString()}
        </span>
      </div>
      <Progress
        value={progressPercentage}
        aria-label={`${progressPercentage.toFixed(0)}% 已收款`}
      />
    </div>
  );
}
