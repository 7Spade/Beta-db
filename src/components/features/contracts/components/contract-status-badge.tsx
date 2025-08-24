/**
 * @fileoverview 合約狀態標籤組件
 */

import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '../utils';
import type { ContractStatus } from '../types';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const variant = getStatusVariant(status);
  
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
