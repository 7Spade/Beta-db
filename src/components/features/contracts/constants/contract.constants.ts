/**
 * @fileoverview 合約相關常數定義
 */

export const CONTRACT_STATUSES = {
  ACTIVE: '啟用中',
  COMPLETED: '已完成',
  PAUSED: '暫停中',
  TERMINATED: '已終止',
} as const;

export const PAYMENT_STATUSES = {
  PAID: '已付款',
  PENDING: '待處理',
  OVERDUE: '已逾期',
} as const;

export const CHANGE_ORDER_STATUSES = {
  APPROVED: '已核准',
  PENDING: '待處理',
  REJECTED: '已拒絕',
} as const;
