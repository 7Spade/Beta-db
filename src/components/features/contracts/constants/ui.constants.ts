/**
 * @fileoverview 合約 UI 相關常數定義
 */

import { CONTRACT_STATUSES, PAYMENT_STATUSES, CHANGE_ORDER_STATUSES } from './contract.constants';

export const UI_CONSTANTS = {
  STATUS_VARIANTS: {
    [CONTRACT_STATUSES.ACTIVE]: 'default',
    [CONTRACT_STATUSES.COMPLETED]: 'secondary',
    [CONTRACT_STATUSES.PAUSED]: 'outline',
    [CONTRACT_STATUSES.TERMINATED]: 'destructive',
    [PAYMENT_STATUSES.PAID]: 'default',
    [PAYMENT_STATUSES.PENDING]: 'outline',
    [PAYMENT_STATUSES.OVERDUE]: 'destructive',
    [CHANGE_ORDER_STATUSES.APPROVED]: 'default',
    [CHANGE_ORDER_STATUSES.PENDING]: 'outline',
    [CHANGE_ORDER_STATUSES.REJECTED]: 'destructive',
  } as const,
} as const;
