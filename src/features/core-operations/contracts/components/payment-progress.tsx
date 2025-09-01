/**
 * @fileoverview 付款進度條組件
 */
'use client';

import type { Contract } from '@/features/core-operations/contracts/types';
import { Progress } from '@/ui/progress';

interface PaymentProgressProps {
  contract: Contract;
}

export function PaymentProgress({ contract }: PaymentProgressProps) {
  const totalPaid = contract.payments
    .filter((p) => p.status === '已付款')
    .reduce((acc, p) => acc + p.amount, 0);
  const paymentProgress =
    contract.totalValue > 0 ? (totalPaid / contract.totalValue) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">
          總付款金額: ${totalPaid.toLocaleString()}
        </span>
        <span className="text-sm font-medium">
          ${contract.totalValue.toLocaleString()}
        </span>
      </div>
      <Progress
        value={paymentProgress}
        aria-label={`${paymentProgress.toFixed(0)}% 已付款`}
      />
    </div>
  );
}
