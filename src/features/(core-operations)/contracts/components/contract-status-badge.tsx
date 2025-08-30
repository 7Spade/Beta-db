/**
 * @fileoverview 合約狀態標籤組件
 */

import type { ContractStatus } from '@/features/(core-operations)/contracts/types';
import { getStatusVariant } from '@/features/(core-operations)/contracts/utils';
import { Badge } from '@/ui/badge';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

export function ContractStatusBadge({
  status,
  className,
}: ContractStatusBadgeProps) {
  const variant = getStatusVariant(status);

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
