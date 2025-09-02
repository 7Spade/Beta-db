/**
 * @fileoverview Engagement 相關常數定義
 */
import type { 
  EngagementStatus, 
  EngagementPhase,
  TaskPriority,
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
  IssueStatus,
  RiskLevel,
  IssuePriority,
  CommunicationType,
  MeetingType,
  DocumentType,
  DocumentStatus
} from '../types';

/**
 * Engagement 狀態常數
 */
export const ENGAGEMENT_STATUSES: EngagementStatus[] = [
  '草稿',
  '已簽約',
  '進行中',
  '暫停',
  '已完成',
  '已終止',
  '已取消',
];

/**
 * Engagement 階段常數
 */
export const ENGAGEMENT_PHASES: EngagementPhase[] = [
  '規劃',
  '執行',
  '監控',
  '收尾',
  '維護',
];

/**
 * 任務優先級常數
 */
export const TASK_PRIORITIES: TaskPriority[] = [
  '低',
  '中',
  '高',
  '緊急',
];

/**
 * 任務狀態常數
 */
export const TASK_STATUSES: TaskStatus[] = [
  '待處理',
  '進行中',
  '已完成',
  '已暫停',
  '已取消',
];

/**
 * 付款狀態常數
 */
export const PAYMENT_STATUSES: PaymentStatus[] = [
  '已付款',
  '待處理',
  '已逾期',
  '已取消',
];

/**
 * 收款狀態常數
 */
export const RECEIPT_STATUSES: ReceiptStatus[] = [
  '已收款',
  '待處理',
  '已逾期',
  '已取消',
];

/**
 * 發票狀態常數
 */
export const INVOICE_STATUSES: InvoiceStatus[] = [
  '草稿',
  '已發送',
  '已付款',
  '已逾期',
  '已取消',
];

/**
 * 變更單狀態常數
 */
export const CHANGE_ORDER_STATUSES: ChangeOrderStatus[] = [
  '已核准',
  '待處理',
  '已拒絕',
  '已取消',
];

/**
 * 里程碑狀態常數
 */
export const MILESTONE_STATUSES: MilestoneStatus[] = [
  '未開始',
  '進行中',
  '已完成',
  '已延遲',
  '已取消',
];

/**
 * 交付物狀態常數
 */
export const DELIVERABLE_STATUSES: DeliverableStatus[] = [
  '未開始',
  '進行中',
  '已完成',
  '已驗收',
  '已拒絕',
];

/**
 * 驗收記錄狀態常數
 */
export const ACCEPTANCE_STATUSES: AcceptanceStatus[] = [
  '草稿',
  '待審批',
  '已批准',
  '已駁回',
];

/**
 * 品質檢查狀態常數
 */
export const QUALITY_CHECK_STATUSES: QualityCheckStatus[] = [
  '待檢查',
  '檢查中',
  '已通過',
  '未通過',
  '需修正',
];

/**
 * 風險狀態常數
 */
export const RISK_STATUSES: RiskStatus[] = [
  '已識別',
  '評估中',
  '已緩解',
  '已接受',
  '已關閉',
];

/**
 * 風險等級常數
 */
export const RISK_LEVELS: RiskLevel[] = [
  '低',
  '中',
  '高',
  '極高',
];

/**
 * 問題狀態常數
 */
export const ISSUE_STATUSES: IssueStatus[] = [
  '新增',
  '處理中',
  '已解決',
  '已關閉',
];

/**
 * 問題優先級常數
 */
export const ISSUE_PRIORITIES: IssuePriority[] = [
  '低',
  '中',
  '高',
  '緊急',
];

/**
 * 溝通類型常數
 */
export const COMMUNICATION_TYPES: CommunicationType[] = [
  'email',
  'meeting',
  'phone',
  'message',
  'document',
  'other',
];

/**
 * 會議類型常數
 */
export const MEETING_TYPES: MeetingType[] = [
  'planning',
  'review',
  'status',
  'decision',
  'problem_solving',
  'other',
];

/**
 * 文件類型常數
 */
export const DOCUMENT_TYPES: DocumentType[] = [
  'contract',
  'proposal',
  'report',
  'specification',
  'manual',
  'other',
];

/**
 * 文件狀態常數
 */
export const DOCUMENT_STATUSES: DocumentStatus[] = [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
];

/**
 * 貨幣選項
 */
export const CURRENCY_OPTIONS = [
  { value: 'TWD', label: '新台幣 (TWD)' },
  { value: 'USD', label: '美元 (USD)' },
  { value: 'EUR', label: '歐元 (EUR)' },
  { value: 'JPY', label: '日圓 (JPY)' },
  { value: 'CNY', label: '人民幣 (CNY)' },
  { value: 'HKD', label: '港幣 (HKD)' },
];

/**
 * 文件訪問級別
 */
export const ACCESS_LEVELS = [
  { value: 'public', label: '公開' },
  { value: 'internal', label: '內部' },
  { value: 'confidential', label: '機密' },
  { value: 'restricted', label: '限制' },
];

/**
 * 風險類別
 */
export const RISK_CATEGORIES = [
  '技術',
  '財務',
  '進度',
  '品質',
  '資源',
  '外部',
  '其他',
];

/**
 * 問題類型
 */
export const ISSUE_TYPES = [
  '缺陷',
  '變更請求',
  '問題',
  '改進建議',
  '其他',
];

/**
 * 交付物類型
 */
export const DELIVERABLE_TYPES = [
  'document',
  'product',
  'service',
  'report',
  'other',
];

/**
 * 品質檢查類型
 */
export const QUALITY_CHECK_TYPES = [
  'inspection',
  'review',
  'test',
  'audit',
  'other',
];

/**
 * 默認分頁大小
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * 最大分頁大小
 */
export const MAX_PAGE_SIZE = 100;

/**
 * 自動刷新間隔 (毫秒)
 */
export const AUTO_REFRESH_INTERVAL = 30000; // 30 秒

/**
 * 文件上傳限制
 */
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
  ],
};

/**
 * 日期格式
 */
export const DATE_FORMATS = {
  SHORT: 'yyyy-MM-dd',
  LONG: 'yyyy年MM月dd日',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  DISPLAY: 'MM/dd/yyyy',
};

/**
 * 狀態轉換規則
 */
export const STATUS_TRANSITION_RULES = {
  ENGAGEMENT: {
    '草稿': ['已簽約', '已取消'],
    '已簽約': ['進行中', '已取消'],
    '進行中': ['暫停', '已完成', '已終止', '已取消'],
    '暫停': ['進行中', '已終止', '已取消'],
    '已完成': [],
    '已終止': [],
    '已取消': [],
  },
  TASK: {
    '待處理': ['進行中', '已取消'],
    '進行中': ['已完成', '已暫停', '已取消'],
    '已完成': [],
    '已暫停': ['進行中', '已取消'],
    '已取消': [],
  },
  PAYMENT: {
    '待處理': ['已付款', '已逾期', '已取消'],
    '已付款': [],
    '已逾期': ['已付款', '已取消'],
    '已取消': [],
  },
};

/**
 * 階段轉換規則
 */
export const PHASE_TRANSITION_RULES = {
  '規劃': ['執行'],
  '執行': ['監控', '收尾'],
  '監控': ['執行', '收尾'],
  '收尾': ['維護'],
  '維護': [],
};

/**
 * 通知類型
 */
export const NOTIFICATION_TYPES = {
  STATUS_CHANGE: 'status_change',
  PHASE_CHANGE: 'phase_change',
  DEADLINE_REMINDER: 'deadline_reminder',
  TASK_ASSIGNMENT: 'task_assignment',
  APPROVAL_REQUEST: 'approval_request',
  PAYMENT_RECEIVED: 'payment_received',
  INVOICE_OVERDUE: 'invoice_overdue',
  RISK_ALERT: 'risk_alert',
  ISSUE_REPORTED: 'issue_reported',
};

/**
 * 審計操作類型
 */
export const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  SUBMIT: 'submit',
  ASSIGN: 'assign',
  COMPLETE: 'complete',
  CANCEL: 'cancel',
  ARCHIVE: 'archive',
  RESTORE: 'restore',
};

/**
 * 審計實體類型
 */
export const AUDIT_ENTITIES = {
  ENGAGEMENT: 'engagement',
  TASK: 'task',
  PAYMENT: 'payment',
  RECEIPT: 'receipt',
  INVOICE: 'invoice',
  CHANGE_ORDER: 'change_order',
  MILESTONE: 'milestone',
  DELIVERABLE: 'deliverable',
  ACCEPTANCE_RECORD: 'acceptance_record',
  QUALITY_CHECK: 'quality_check',
  RISK: 'risk',
  ISSUE: 'issue',
  COMMUNICATION: 'communication',
  MEETING: 'meeting',
  DOCUMENT: 'document',
  ATTACHMENT: 'attachment',
};