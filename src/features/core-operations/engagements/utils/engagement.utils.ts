/**
 * @fileoverview Engagement 相關的工具函數
 */
import type {
  Engagement,
  EngagementPhase,
  EngagementStatus,
  EngagementSummary
} from '../types';

/**
 * 安全地將 Date | Timestamp 轉換為 Date
 */
function toDate(date: Date | any): Date {
  if (date instanceof Date) {
    return date;
  }
  if (date && typeof date.toDate === 'function') {
    return date.toDate();
  }
  return new Date(date);
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | any, format: 'short' | 'long' | 'iso' = 'short'): string {
  if (!date) return '未設定';

  const d = date.toDate ? date.toDate() : new Date(date);

  switch (format) {
    case 'short':
      return d.toLocaleDateString('zh-TW');
    case 'long':
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    case 'iso':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString('zh-TW');
  }
}

/**
 * 格式化貨幣
 */
export function formatCurrency(amount: number, currency: string = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * 計算 Engagement 的進度百分比
 */
export function calculateEngagementProgress(engagement: Engagement): number {
  if (engagement.tasks.length === 0) {
    return 0;
  }

  const totalValue = engagement.tasks.reduce((sum, task) => sum + task.value, 0);
  const completedValue = engagement.tasks.reduce(
    (sum, task) => sum + (task.value * task.completedQuantity / task.quantity),
    0
  );

  return totalValue > 0 ? Math.round((completedValue / totalValue) * 100) : 0;
}

/**
 * 計算財務摘要
 */
export function calculateFinancialSummary(engagement: Engagement) {
  const totalPaid = engagement.payments
    .filter(p => p.status === '已付款')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = engagement.payments
    .filter(p => p.status === '待處理')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = engagement.payments
    .filter(p => p.status === '已逾期')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalReceived = engagement.receipts
    .filter(r => r.status === '已收款')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalInvoiceAmount = engagement.invoices
    .filter(i => i.status === '已付款')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const paymentProgress = engagement.totalValue > 0 ? (totalPaid / engagement.totalValue) * 100 : 0;
  const receiptProgress = engagement.totalValue > 0 ? (totalReceived / engagement.totalValue) * 100 : 0;
  const invoiceProgress = engagement.totalValue > 0 ? (totalInvoiceAmount / engagement.totalValue) * 100 : 0;

  return {
    totalValue: engagement.totalValue,
    paidAmount: totalPaid,
    pendingAmount: totalPending,
    overdueAmount: totalOverdue,
    receivedAmount: totalReceived,
    invoiceAmount: totalInvoiceAmount,
    paymentProgress: Math.round(paymentProgress),
    receiptProgress: Math.round(receiptProgress),
    invoiceProgress: Math.round(invoiceProgress),
  };
}

/**
 * 計算任務統計
 */
export function calculateTaskStats(engagement: Engagement) {
  const totalTasks = engagement.tasks.length;
  const completedTasks = engagement.tasks.filter(task => task.status === '已完成').length;
  const inProgressTasks = engagement.tasks.filter(task => task.status === '進行中').length;
  const pendingTasks = engagement.tasks.filter(task => task.status === '待處理').length;

  const totalValue = engagement.tasks.reduce((sum, task) => sum + task.value, 0);
  const completedValue = engagement.tasks
    .filter(task => task.status === '已完成')
    .reduce((sum, task) => sum + task.value, 0);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    totalValue,
    completedValue,
    progressPercentage: totalValue > 0 ? Math.round((completedValue / totalValue) * 100) : 0,
  };
}

/**
 * 計算風險統計
 */
export function calculateRiskStats(engagement: Engagement) {
  const totalRisks = engagement.risks.length;
  const highRisks = engagement.risks.filter(risk => risk.level === '高' || risk.level === '極高').length;
  const openRisks = engagement.risks.filter(risk => risk.status === '已識別' || risk.status === '評估中').length;

  return {
    totalRisks,
    highRisks,
    openRisks,
    riskScore: totalRisks > 0 ? Math.round((highRisks / totalRisks) * 100) : 0,
  };
}

/**
 * 計算問題統計
 */
export function calculateIssueStats(engagement: Engagement) {
  const totalIssues = engagement.issues.length;
  const openIssues = engagement.issues.filter(issue => issue.status === '新增' || issue.status === '處理中').length;
  const highPriorityIssues = engagement.issues.filter(issue => issue.priority === '高' || issue.priority === '緊急').length;

  return {
    totalIssues,
    openIssues,
    highPriorityIssues,
    resolutionRate: totalIssues > 0 ? Math.round(((totalIssues - openIssues) / totalIssues) * 100) : 0,
  };
}

/**
 * 檢查 Engagement 是否逾期
 */
export function isEngagementOverdue(engagement: Engagement): boolean {
  const endDate = toDate(engagement.endDate);
  return endDate < new Date() && engagement.status !== '已完成' && engagement.status !== '已終止' && engagement.status !== '已取消';
}

/**
 * 計算剩餘天數
 */
export function calculateDaysRemaining(engagement: Engagement): number {
  const endDate = toDate(engagement.endDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 獲取狀態顏色
 */
export function getStatusColor(status: EngagementStatus): string {
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
 * 獲取階段顏色
 */
export function getPhaseColor(phase: EngagementPhase): string {
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
 * 生成 Engagement 摘要
 */
export function generateEngagementSummary(engagement: Engagement): EngagementSummary {
  return {
    id: engagement.id,
    customId: engagement.customId,
    name: engagement.name,
    contractor: engagement.contractor,
    client: engagement.client,
    startDate: engagement.startDate,
    endDate: engagement.endDate,
    totalValue: engagement.totalValue,
    status: engagement.status,
    phase: engagement.phase,
    progressPercentage: calculateEngagementProgress(engagement),
  };
}

/**
 * 排序 Engagements
 */
export function sortEngagements(
  engagements: Engagement[],
  sortBy: 'name' | 'startDate' | 'endDate' | 'totalValue' | 'status' | 'phase',
  order: 'asc' | 'desc' = 'asc'
): Engagement[] {
  return [...engagements].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'startDate':
        aValue = toDate(a.startDate);
        bValue = toDate(b.startDate);
        break;
      case 'endDate':
        aValue = toDate(a.endDate);
        bValue = toDate(b.endDate);
        break;
      case 'totalValue':
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'phase':
        aValue = a.phase;
        bValue = b.phase;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 過濾 Engagements
 */
export function filterEngagements(
  engagements: Engagement[],
  filters: {
    status?: EngagementStatus[];
    phase?: EngagementPhase[];
    contractor?: string;
    client?: string;
    search?: string;
  }
): Engagement[] {
  return engagements.filter(engagement => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(engagement.status)) {
      return false;
    }

    if (filters.phase && filters.phase.length > 0 && !filters.phase.includes(engagement.phase)) {
      return false;
    }

    if (filters.contractor && !engagement.contractor.toLowerCase().includes(filters.contractor.toLowerCase())) {
      return false;
    }

    if (filters.client && !engagement.client.toLowerCase().includes(filters.client.toLowerCase())) {
      return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        engagement.name.toLowerCase().includes(searchLower) ||
        engagement.description.toLowerCase().includes(searchLower) ||
        engagement.contractor.toLowerCase().includes(searchLower) ||
        engagement.client.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}