/**
 * @fileoverview 狀態相關常數定義
 */

/**
 * 狀態顏色映射
 */
export const STATUS_COLORS = {
  // Engagement 狀態顏色
  ENGAGEMENT: {
    '草稿': 'bg-gray-100 text-gray-800',
    '已簽約': 'bg-blue-100 text-blue-800',
    '進行中': 'bg-green-100 text-green-800',
    '暫停': 'bg-yellow-100 text-yellow-800',
    '已完成': 'bg-emerald-100 text-emerald-800',
    '已終止': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // Engagement 階段顏色
  PHASE: {
    '規劃': 'bg-purple-100 text-purple-800',
    '執行': 'bg-blue-100 text-blue-800',
    '監控': 'bg-orange-100 text-orange-800',
    '收尾': 'bg-green-100 text-green-800',
    '維護': 'bg-indigo-100 text-indigo-800',
  },
  
  // 任務狀態顏色
  TASK: {
    '待處理': 'bg-gray-100 text-gray-800',
    '進行中': 'bg-blue-100 text-blue-800',
    '已完成': 'bg-green-100 text-green-800',
    '已暫停': 'bg-yellow-100 text-yellow-800',
    '已取消': 'bg-red-100 text-red-800',
  },
  
  // 付款狀態顏色
  PAYMENT: {
    '已付款': 'bg-green-100 text-green-800',
    '待處理': 'bg-yellow-100 text-yellow-800',
    '已逾期': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // 收款狀態顏色
  RECEIPT: {
    '已收款': 'bg-green-100 text-green-800',
    '待處理': 'bg-yellow-100 text-yellow-800',
    '已逾期': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // 發票狀態顏色
  INVOICE: {
    '草稿': 'bg-gray-100 text-gray-800',
    '已發送': 'bg-blue-100 text-blue-800',
    '已付款': 'bg-green-100 text-green-800',
    '已逾期': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // 變更單狀態顏色
  CHANGE_ORDER: {
    '已核准': 'bg-green-100 text-green-800',
    '待處理': 'bg-yellow-100 text-yellow-800',
    '已拒絕': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // 里程碑狀態顏色
  MILESTONE: {
    '未開始': 'bg-gray-100 text-gray-800',
    '進行中': 'bg-blue-100 text-blue-800',
    '已完成': 'bg-green-100 text-green-800',
    '已延遲': 'bg-red-100 text-red-800',
    '已取消': 'bg-gray-100 text-gray-800',
  },
  
  // 交付物狀態顏色
  DELIVERABLE: {
    '未開始': 'bg-gray-100 text-gray-800',
    '進行中': 'bg-blue-100 text-blue-800',
    '已完成': 'bg-green-100 text-green-800',
    '已驗收': 'bg-emerald-100 text-emerald-800',
    '已拒絕': 'bg-red-100 text-red-800',
  },
  
  // 驗收記錄狀態顏色
  ACCEPTANCE: {
    '草稿': 'bg-gray-100 text-gray-800',
    '待審批': 'bg-yellow-100 text-yellow-800',
    '已批准': 'bg-green-100 text-green-800',
    '已駁回': 'bg-red-100 text-red-800',
  },
  
  // 品質檢查狀態顏色
  QUALITY_CHECK: {
    '待檢查': 'bg-gray-100 text-gray-800',
    '檢查中': 'bg-blue-100 text-blue-800',
    '已通過': 'bg-green-100 text-green-800',
    '未通過': 'bg-red-100 text-red-800',
    '需修正': 'bg-yellow-100 text-yellow-800',
  },
  
  // 風險狀態顏色
  RISK: {
    '已識別': 'bg-yellow-100 text-yellow-800',
    '評估中': 'bg-orange-100 text-orange-800',
    '已緩解': 'bg-green-100 text-green-800',
    '已接受': 'bg-blue-100 text-blue-800',
    '已關閉': 'bg-gray-100 text-gray-800',
  },
  
  // 問題狀態顏色
  ISSUE: {
    '新增': 'bg-red-100 text-red-800',
    '處理中': 'bg-yellow-100 text-yellow-800',
    '已解決': 'bg-green-100 text-green-800',
    '已關閉': 'bg-gray-100 text-gray-800',
  },
};

/**
 * 狀態圖標映射
 */
export const STATUS_ICONS = {
  // Engagement 狀態圖標
  ENGAGEMENT: {
    '草稿': '📝',
    '已簽約': '📋',
    '進行中': '🚀',
    '暫停': '⏸️',
    '已完成': '✅',
    '已終止': '🛑',
    '已取消': '❌',
  },
  
  // Engagement 階段圖標
  PHASE: {
    '規劃': '📊',
    '執行': '⚡',
    '監控': '👁️',
    '收尾': '🏁',
    '維護': '🔧',
  },
  
  // 任務狀態圖標
  TASK: {
    '待處理': '⏳',
    '進行中': '🔄',
    '已完成': '✅',
    '已暫停': '⏸️',
    '已取消': '❌',
  },
  
  // 付款狀態圖標
  PAYMENT: {
    '已付款': '💰',
    '待處理': '⏳',
    '已逾期': '⚠️',
    '已取消': '❌',
  },
  
  // 收款狀態圖標
  RECEIPT: {
    '已收款': '💰',
    '待處理': '⏳',
    '已逾期': '⚠️',
    '已取消': '❌',
  },
  
  // 發票狀態圖標
  INVOICE: {
    '草稿': '📝',
    '已發送': '📤',
    '已付款': '💰',
    '已逾期': '⚠️',
    '已取消': '❌',
  },
  
  // 變更單狀態圖標
  CHANGE_ORDER: {
    '已核准': '✅',
    '待處理': '⏳',
    '已拒絕': '❌',
    '已取消': '🚫',
  },
  
  // 里程碑狀態圖標
  MILESTONE: {
    '未開始': '⏳',
    '進行中': '🔄',
    '已完成': '🏆',
    '已延遲': '⏰',
    '已取消': '❌',
  },
  
  // 交付物狀態圖標
  DELIVERABLE: {
    '未開始': '⏳',
    '進行中': '🔄',
    '已完成': '📦',
    '已驗收': '✅',
    '已拒絕': '❌',
  },
  
  // 驗收記錄狀態圖標
  ACCEPTANCE: {
    '草稿': '📝',
    '待審批': '⏳',
    '已批准': '✅',
    '已駁回': '❌',
  },
  
  // 品質檢查狀態圖標
  QUALITY_CHECK: {
    '待檢查': '⏳',
    '檢查中': '🔍',
    '已通過': '✅',
    '未通過': '❌',
    '需修正': '🔧',
  },
  
  // 風險狀態圖標
  RISK: {
    '已識別': '⚠️',
    '評估中': '🔍',
    '已緩解': '✅',
    '已接受': '👍',
    '已關閉': '🔒',
  },
  
  // 問題狀態圖標
  ISSUE: {
    '新增': '🚨',
    '處理中': '🔄',
    '已解決': '✅',
    '已關閉': '🔒',
  },
};

/**
 * 優先級顏色映射
 */
export const PRIORITY_COLORS = {
  TASK: {
    '低': 'bg-gray-100 text-gray-800',
    '中': 'bg-blue-100 text-blue-800',
    '高': 'bg-orange-100 text-orange-800',
    '緊急': 'bg-red-100 text-red-800',
  },
  ISSUE: {
    '低': 'bg-gray-100 text-gray-800',
    '中': 'bg-blue-100 text-blue-800',
    '高': 'bg-orange-100 text-orange-800',
    '緊急': 'bg-red-100 text-red-800',
  },
  RISK: {
    '低': 'bg-green-100 text-green-800',
    '中': 'bg-yellow-100 text-yellow-800',
    '高': 'bg-orange-100 text-orange-800',
    '極高': 'bg-red-100 text-red-800',
  },
};

/**
 * 優先級圖標映射
 */
export const PRIORITY_ICONS = {
  TASK: {
    '低': '🔵',
    '中': '🟡',
    '高': '🟠',
    '緊急': '🔴',
  },
  ISSUE: {
    '低': '🔵',
    '中': '🟡',
    '高': '🟠',
    '緊急': '🔴',
  },
  RISK: {
    '低': '🟢',
    '中': '🟡',
    '高': '🟠',
    '極高': '🔴',
  },
};

/**
 * 進度條顏色映射
 */
export const PROGRESS_COLORS = {
  LOW: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-green-500',
  COMPLETE: 'bg-emerald-500',
};

/**
 * 獲取進度條顏色
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return PROGRESS_COLORS.COMPLETE;
  if (percentage >= 75) return PROGRESS_COLORS.HIGH;
  if (percentage >= 50) return PROGRESS_COLORS.MEDIUM;
  return PROGRESS_COLORS.LOW;
}

/**
 * 狀態順序映射 (用於排序)
 */
export const STATUS_ORDER = {
  ENGAGEMENT: {
    '草稿': 1,
    '已簽約': 2,
    '進行中': 3,
    '暫停': 4,
    '已完成': 5,
    '已終止': 6,
    '已取消': 7,
  },
  TASK: {
    '待處理': 1,
    '進行中': 2,
    '已暫停': 3,
    '已完成': 4,
    '已取消': 5,
  },
  PAYMENT: {
    '待處理': 1,
    '已付款': 2,
    '已逾期': 3,
    '已取消': 4,
  },
  RECEIPT: {
    '待處理': 1,
    '已收款': 2,
    '已逾期': 3,
    '已取消': 4,
  },
  INVOICE: {
    '草稿': 1,
    '已發送': 2,
    '已付款': 3,
    '已逾期': 4,
    '已取消': 5,
  },
};

/**
 * 獲取狀態順序
 */
export function getStatusOrder(category: keyof typeof STATUS_ORDER, status: string): number {
  return STATUS_ORDER[category]?.[status as keyof typeof STATUS_ORDER[typeof category]] || 999;
}