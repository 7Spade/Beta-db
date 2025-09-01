/**
 * @fileoverview 狀態處理工具
 */
import type { ContractStatus } from '@/features/core-operations/contracts/types';

export const getStatusVariant = (
  status: ContractStatus
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case '啟用中':
      return 'default';
    case '已完成':
      return 'secondary';
    case '暫停中':
      return 'outline';
    case '已終止':
      return 'destructive';
    default:
      return 'default';
  }
};
