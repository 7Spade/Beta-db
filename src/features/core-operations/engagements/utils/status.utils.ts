/**
 * @fileoverview 狀態相關的工具函數
 */
import type { 
  EngagementStatus, 
  EngagementPhase,
  TaskStatus,
  PaymentStatus,
  ReceiptStatus,
  InvoiceStatus,
  ChangeOrderStatus,
  MilestoneStatus,
  DeliverableStatus,
  AcceptanceStatus,
  QualityCheckStatus,
  RiskStatus,
  IssueStatus
} from '../types';

/**
 * 獲取 Engagement 狀態的顯示文本
 */
export function getEngagementStatusText(status: EngagementStatus): string {
  return status;
}

/**
 * 獲取 Engagement 狀態的顏色
 */
export function getEngagementStatusColor(status: EngagementStatus): string {
  switch (status) {
    case '草稿': return 'bg-gray-100 text-gray-800';
    case '已簽約': return 'bg-blue-100 text-blue-800';
    case '進行中': return 'bg-green-100 text-green-800';
    case '暫停': return 'bg-yellow-100 text-yellow-800';
    case '已完成': return 'bg-emerald-100 text-emerald-800';
    case '已終止': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取 Engagement 階段的顯示文本
 */
export function getEngagementPhaseText(phase: EngagementPhase): string {
  return phase;
}

/**
 * 獲取 Engagement 階段的顏色
 */
export function getEngagementPhaseColor(phase: EngagementPhase): string {
  switch (phase) {
    case '規劃': return 'bg-purple-100 text-purple-800';
    case '執行': return 'bg-blue-100 text-blue-800';
    case '監控': return 'bg-orange-100 text-orange-800';
    case '收尾': return 'bg-green-100 text-green-800';
    case '維護': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取任務狀態的顯示文本
 */
export function getTaskStatusText(status: TaskStatus): string {
  return status;
}

/**
 * 獲取任務狀態的顏色
 */
export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case '待處理': return 'bg-gray-100 text-gray-800';
    case '進行中': return 'bg-blue-100 text-blue-800';
    case '已完成': return 'bg-green-100 text-green-800';
    case '已暫停': return 'bg-yellow-100 text-yellow-800';
    case '已取消': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取付款狀態的顯示文本
 */
export function getPaymentStatusText(status: PaymentStatus): string {
  return status;
}

/**
 * 獲取付款狀態的顏色
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case '已付款': return 'bg-green-100 text-green-800';
    case '待處理': return 'bg-yellow-100 text-yellow-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取收款狀態的顯示文本
 */
export function getReceiptStatusText(status: ReceiptStatus): string {
  return status;
}

/**
 * 獲取收款狀態的顏色
 */
export function getReceiptStatusColor(status: ReceiptStatus): string {
  switch (status) {
    case '已收款': return 'bg-green-100 text-green-800';
    case '待處理': return 'bg-yellow-100 text-yellow-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取發票狀態的顯示文本
 */
export function getInvoiceStatusText(status: InvoiceStatus): string {
  return status;
}

/**
 * 獲取發票狀態的顏色
 */
export function getInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case '草稿': return 'bg-gray-100 text-gray-800';
    case '已發送': return 'bg-blue-100 text-blue-800';
    case '已付款': return 'bg-green-100 text-green-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取變更單狀態的顯示文本
 */
export function getChangeOrderStatusText(status: ChangeOrderStatus): string {
  return status;
}

/**
 * 獲取變更單狀態的顏色
 */
export function getChangeOrderStatusColor(status: ChangeOrderStatus): string {
  switch (status) {
    case '已核准': return 'bg-green-100 text-green-800';
    case '待處理': return 'bg-yellow-100 text-yellow-800';
    case '已拒絕': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取里程碑狀態的顯示文本
 */
export function getMilestoneStatusText(status: MilestoneStatus): string {
  return status;
}

/**
 * 獲取里程碑狀態的顏色
 */
export function getMilestoneStatusColor(status: MilestoneStatus): string {
  switch (status) {
    case '未開始': return 'bg-gray-100 text-gray-800';
    case '進行中': return 'bg-blue-100 text-blue-800';
    case '已完成': return 'bg-green-100 text-green-800';
    case '已延遲': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取交付物狀態的顯示文本
 */
export function getDeliverableStatusText(status: DeliverableStatus): string {
  return status;
}

/**
 * 獲取交付物狀態的顏色
 */
export function getDeliverableStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case '未開始': return 'bg-gray-100 text-gray-800';
    case '進行中': return 'bg-blue-100 text-blue-800';
    case '已完成': return 'bg-green-100 text-green-800';
    case '已驗收': return 'bg-emerald-100 text-emerald-800';
    case '已拒絕': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取驗收記錄狀態的顯示文本
 */
export function getAcceptanceStatusText(status: AcceptanceStatus): string {
  return status;
}

/**
 * 獲取驗收記錄狀態的顏色
 */
export function getAcceptanceStatusColor(status: AcceptanceStatus): string {
  switch (status) {
    case '草稿': return 'bg-gray-100 text-gray-800';
    case '待審批': return 'bg-yellow-100 text-yellow-800';
    case '已批准': return 'bg-green-100 text-green-800';
    case '已駁回': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取品質檢查狀態的顯示文本
 */
export function getQualityCheckStatusText(status: QualityCheckStatus): string {
  return status;
}

/**
 * 獲取品質檢查狀態的顏色
 */
export function getQualityCheckStatusColor(status: QualityCheckStatus): string {
  switch (status) {
    case '待檢查': return 'bg-gray-100 text-gray-800';
    case '檢查中': return 'bg-blue-100 text-blue-800';
    case '已通過': return 'bg-green-100 text-green-800';
    case '未通過': return 'bg-red-100 text-red-800';
    case '需修正': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取風險狀態的顯示文本
 */
export function getRiskStatusText(status: RiskStatus): string {
  return status;
}

/**
 * 獲取風險狀態的顏色
 */
export function getRiskStatusColor(status: RiskStatus): string {
  switch (status) {
    case '已識別': return 'bg-yellow-100 text-yellow-800';
    case '評估中': return 'bg-orange-100 text-orange-800';
    case '已緩解': return 'bg-green-100 text-green-800';
    case '已接受': return 'bg-blue-100 text-blue-800';
    case '已關閉': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取問題狀態的顯示文本
 */
export function getIssueStatusText(status: IssueStatus): string {
  return status;
}

/**
 * 獲取問題狀態的顏色
 */
export function getIssueStatusColor(status: IssueStatus): string {
  switch (status) {
    case '新增': return 'bg-red-100 text-red-800';
    case '處理中': return 'bg-yellow-100 text-yellow-800';
    case '已解決': return 'bg-green-100 text-green-800';
    case '已關閉': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取所有 Engagement 狀態選項
 */
export function getEngagementStatusOptions(): Array<{ value: EngagementStatus; label: string }> {
  return [
    { value: '草稿', label: '草稿' },
    { value: '已簽約', label: '已簽約' },
    { value: '進行中', label: '進行中' },
    { value: '暫停', label: '暫停' },
    { value: '已完成', label: '已完成' },
    { value: '已終止', label: '已終止' },
    { value: '已取消', label: '已取消' },
  ];
}

/**
 * 獲取所有 Engagement 階段選項
 */
export function getEngagementPhaseOptions(): Array<{ value: EngagementPhase; label: string }> {
  return [
    { value: '規劃', label: '規劃' },
    { value: '執行', label: '執行' },
    { value: '監控', label: '監控' },
    { value: '收尾', label: '收尾' },
    { value: '維護', label: '維護' },
  ];
}

/**
 * 獲取所有任務狀態選項
 */
export function getTaskStatusOptions(): Array<{ value: TaskStatus; label: string }> {
  return [
    { value: '待處理', label: '待處理' },
    { value: '進行中', label: '進行中' },
    { value: '已完成', label: '已完成' },
    { value: '已暫停', label: '已暫停' },
    { value: '已取消', label: '已取消' },
  ];
}

/**
 * 檢查狀態轉換是否有效
 */
export function isValidStatusTransition(
  currentStatus: EngagementStatus,
  newStatus: EngagementStatus
): boolean {
  const validTransitions: Record<EngagementStatus, EngagementStatus[]> = {
    '草稿': ['已簽約', '已取消'],
    '已簽約': ['進行中', '已取消'],
    '進行中': ['暫停', '已完成', '已終止', '已取消'],
    '暫停': ['進行中', '已終止', '已取消'],
    '已完成': [], // 已完成狀態不能轉換到其他狀態
    '已終止': [], // 已終止狀態不能轉換到其他狀態
    '已取消': [], // 已取消狀態不能轉換到其他狀態
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * 檢查階段轉換是否有效
 */
export function isValidPhaseTransition(
  currentPhase: EngagementPhase,
  newPhase: EngagementPhase
): boolean {
  const validTransitions: Record<EngagementPhase, EngagementPhase[]> = {
    '規劃': ['執行'],
    '執行': ['監控', '收尾'],
    '監控': ['執行', '收尾'],
    '收尾': ['維護'],
    '維護': [], // 維護階段通常是最終階段
  };

  return validTransitions[currentPhase]?.includes(newPhase) || false;
}