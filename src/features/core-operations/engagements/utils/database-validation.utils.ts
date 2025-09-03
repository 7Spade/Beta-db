/**
 * @fileoverview 數據庫驗證工具
 * 提供全面的數據驗證、安全檢查和性能優化功能
 */
import type {
  CreateAttachmentInput,
  CreateCommunicationInput,
  CreateDocumentInput,
  CreateEngagementInput,
  CreateInvoiceInput,
  CreateMeetingInput,
  CreatePaymentInput,
  CreateReceiptInput,
  CreateTaskInput,
  UpdateEngagementInput,
} from '../types';

// 安全威脅檢測
const SECURITY_THREATS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /@import/gi,
  /eval\s*\(/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
  /document\./gi,
  /window\./gi,
  /alert\s*\(/gi,
  /confirm\s*\(/gi,
  /prompt\s*\(/gi,
];

// SQL 注入檢測
const SQL_INJECTION_PATTERNS = [
  /('|(\\')|(;)|(\-\-)|(\s+or\s+)|(\s+and\s+)|(\s+union\s+)|(\s+select\s+)|(\s+insert\s+)|(\s+update\s+)|(\s+delete\s+)|(\s+drop\s+)|(\s+create\s+)|(\s+alter\s+)|(\s+exec\s+)|(\s+execute\s+))/gi,
  /(\s+or\s+\d+\s*=\s*\d+)/gi,
  /(\s+and\s+\d+\s*=\s*\d+)/gi,
  /(\s+union\s+select\s+)/gi,
  /(\s+drop\s+table\s+)/gi,
  /(\s+delete\s+from\s+)/gi,
  /(\s+insert\s+into\s+)/gi,
  /(\s+update\s+\w+\s+set\s+)/gi,
];

// 驗證結果接口
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 驗證配置
interface ValidationConfig {
  maxStringLength: number;
  maxTextLength: number;
  maxNumberValue: number;
  minNumberValue: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  enableSecurityCheck: boolean;
  enableSQLInjectionCheck: boolean;
}

const DEFAULT_CONFIG: ValidationConfig = {
  maxStringLength: 200,
  maxTextLength: 1000,
  maxNumberValue: 1000000000,
  minNumberValue: 0,
  allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  enableSecurityCheck: true,
  enableSQLInjectionCheck: true,
};

export class DatabaseValidation {
  private config: ValidationConfig;

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 驗證字符串輸入
   */
  private validateString(value: any, fieldName: string, required = true, maxLength?: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (required && (!value || value.toString().trim().length === 0)) {
      errors.push(`${fieldName} 不能為空`);
      return { isValid: false, errors, warnings };
    }

    if (value !== null && value !== undefined) {
      const stringValue = value.toString();
      const length = maxLength || this.config.maxStringLength;

      if (stringValue.length > length) {
        errors.push(`${fieldName} 長度不能超過 ${length} 個字符`);
      }

      // 安全檢查
      if (this.config.enableSecurityCheck) {
        if (this.containsSecurityThreats(stringValue)) {
          errors.push(`${fieldName} 包含不安全的內容`);
        }
      }

      // SQL 注入檢查
      if (this.config.enableSQLInjectionCheck) {
        if (this.containsSQLInjection(stringValue)) {
          errors.push(`${fieldName} 包含不安全的 SQL 語句`);
        }
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 驗證數字輸入
   */
  private validateNumber(value: any, fieldName: string, required = true, min?: number, max?: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (required && (value === null || value === undefined || value === '')) {
      errors.push(`${fieldName} 不能為空`);
      return { isValid: false, errors, warnings };
    }

    if (value !== null && value !== undefined && value !== '') {
      const numValue = Number(value);

      if (isNaN(numValue)) {
        errors.push(`${fieldName} 必須是有效的數字`);
        return { isValid: false, errors, warnings };
      }

      const minValue = min !== undefined ? min : this.config.minNumberValue;
      const maxValue = max !== undefined ? max : this.config.maxNumberValue;

      if (numValue < minValue) {
        errors.push(`${fieldName} 不能小於 ${minValue}`);
      }

      if (numValue > maxValue) {
        errors.push(`${fieldName} 不能大於 ${maxValue}`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 驗證日期輸入
   */
  private validateDate(value: any, fieldName: string, required = true): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (required && (!value || value === '')) {
      errors.push(`${fieldName} 不能為空`);
      return { isValid: false, errors, warnings };
    }

    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push(`${fieldName} 必須是有效的日期`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 驗證文件輸入
   */
  private validateFile(file: any, fieldName: string, required = true): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (required && !file) {
      errors.push(`${fieldName} 不能為空`);
      return { isValid: false, errors, warnings };
    }

    if (file) {
      // 檢查文件大小
      if (file.size > this.config.maxFileSize) {
        errors.push(`${fieldName} 文件大小不能超過 ${this.config.maxFileSize / (1024 * 1024)}MB`);
      }

      // 檢查文件類型
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && !this.config.allowedFileTypes.includes(fileExtension)) {
        errors.push(`${fieldName} 文件類型不允許，支持的類型: ${this.config.allowedFileTypes.join(', ')}`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 檢測安全威脅
   */
  private containsSecurityThreats(value: string): boolean {
    return SECURITY_THREATS.some(pattern => pattern.test(value));
  }

  /**
   * 檢測 SQL 注入
   */
  private containsSQLInjection(value: string): boolean {
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
  }

  /**
   * 合併驗證結果
   */
  private mergeResults(...results: ValidationResult[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    results.forEach(result => {
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 驗證創建 Engagement 輸入
   */
  validateCreateEngagementInput(input: CreateEngagementInput): ValidationResult {
    const results = [
      this.validateString(input.name, '專案名稱', true),
      this.validateString(input.description, '專案描述', true, this.config.maxTextLength),
      this.validateString(input.contractor, '承包商', true),
      this.validateString(input.client, '客戶', true),
      this.validateString(input.clientRepresentative, '客戶代表', false),
      this.validateDate(input.startDate, '開始日期', true),
      this.validateDate(input.endDate, '結束日期', true),
      this.validateNumber(input.totalValue, '總價值', true, 0),
      this.validateString(input.currency, '貨幣', true),
      this.validateString(input.scope, '工作範疇', true, this.config.maxTextLength),
    ];

    // 檢查日期邏輯
    if (input.startDate && input.endDate) {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);
      if (startDate >= endDate) {
        results.push({
          isValid: false,
          errors: ['開始日期必須早於結束日期'],
          warnings: [],
        });
      }
    }

    return this.mergeResults(...results);
  }

  /**
   * 驗證更新 Engagement 輸入
   */
  validateUpdateEngagementInput(input: UpdateEngagementInput): ValidationResult {
    const results: ValidationResult[] = [];

    if (input.name !== undefined) {
      results.push(this.validateString(input.name, '專案名稱', true));
    }
    if (input.description !== undefined) {
      results.push(this.validateString(input.description, '專案描述', true, this.config.maxTextLength));
    }
    if (input.contractor !== undefined) {
      results.push(this.validateString(input.contractor, '承包商', true));
    }
    if (input.client !== undefined) {
      results.push(this.validateString(input.client, '客戶', true));
    }
    if (input.clientRepresentative !== undefined) {
      results.push(this.validateString(input.clientRepresentative, '客戶代表', false));
    }
    if (input.startDate !== undefined) {
      results.push(this.validateDate(input.startDate, '開始日期', true));
    }
    if (input.endDate !== undefined) {
      results.push(this.validateDate(input.endDate, '結束日期', true));
    }
    if (input.actualStartDate !== undefined) {
      results.push(this.validateDate(input.actualStartDate, '實際開始日期', false));
    }
    if (input.actualEndDate !== undefined) {
      results.push(this.validateDate(input.actualEndDate, '實際結束日期', false));
    }
    if (input.totalValue !== undefined) {
      results.push(this.validateNumber(input.totalValue, '總價值', true, 0));
    }
    if (input.currency !== undefined) {
      results.push(this.validateString(input.currency, '貨幣', true));
    }
    if (input.scope !== undefined) {
      results.push(this.validateString(input.scope, '工作範疇', true, this.config.maxTextLength));
    }

    // 檢查日期邏輯
    if (input.startDate && input.endDate) {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);
      if (startDate >= endDate) {
        results.push({
          isValid: false,
          errors: ['開始日期必須早於結束日期'],
          warnings: [],
        });
      }
    }

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建任務輸入
   */
  validateCreateTaskInput(input: CreateTaskInput): ValidationResult {
    const results = [
      this.validateString(input.title, '任務標題', true),
      this.validateString(input.description, '任務描述', false, this.config.maxTextLength),
      this.validateString(input.priority, '優先級', true),
      this.validateNumber(input.quantity, '數量', true, 0),
      this.validateNumber(input.unitPrice, '單價', true, 0),
      this.validateNumber(input.discount, '折扣', false, 0),
      this.validateDate(input.dueDate, '截止日期', false),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建付款輸入
   */
  validateCreatePaymentInput(input: CreatePaymentInput): ValidationResult {
    const results = [
      this.validateString(input.description, '付款描述', false),
      this.validateNumber(input.amount, '付款金額', true, 0),
      this.validateString(input.paymentMethod, '付款方式', false),
      this.validateString(input.referenceNumber, '參考號碼', false),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建收款輸入
   */
  validateCreateReceiptInput(input: CreateReceiptInput): ValidationResult {
    const results = [
      this.validateString(input.description, '收款描述', false),
      this.validateNumber(input.amount, '收款金額', true, 0),
      this.validateString(input.invoiceNumber, '發票號碼', false),
      this.validateString(input.paymentMethod, '付款方式', false),
      this.validateString(input.referenceNumber, '參考號碼', false),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建發票輸入
   */
  validateCreateInvoiceInput(input: CreateInvoiceInput): ValidationResult {
    const results = [
      this.validateString(input.invoiceNumber, '發票號碼', true),
      this.validateNumber(input.amount, '發票金額', true, 0),
      this.validateNumber(input.taxAmount || 0, '稅額', false, 0),
      this.validateDate(input.dueDate, '到期日期', true),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建文件輸入
   */
  validateCreateDocumentInput(input: CreateDocumentInput): ValidationResult {
    const results = [
      this.validateString(input.title, '文件標題', true),
      this.validateString(input.type, '文件類型', true),
      this.validateString(input.fileName, '文件名稱', true),
      this.validateString(input.mimeType, 'MIME 類型', true),
      this.validateNumber(input.fileSize, '文件大小', true, 0),
      this.validateString(input.fileUrl, '文件 URL', true),
      this.validateString(input.accessLevel, '訪問級別', true),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建附件輸入
   */
  validateCreateAttachmentInput(input: CreateAttachmentInput): ValidationResult {
    const results = [
      this.validateString(input.fileName, '文件名稱', true),
      this.validateString(input.mimeType, 'MIME 類型', true),
      this.validateNumber(input.fileSize, '文件大小', true, 0),
      this.validateString(input.fileUrl, '文件 URL', true),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建溝通記錄輸入
   */
  validateCreateCommunicationInput(input: CreateCommunicationInput): ValidationResult {
    const results = [
      this.validateString(input.type, '溝通類型', true),
      this.validateString(input.subject, '主題', true),
      this.validateString(input.content, '內容', true, this.config.maxTextLength),
      this.validateString(input.participants?.join(', ') || '', '參與者', false),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證創建會議輸入
   */
  validateCreateMeetingInput(input: CreateMeetingInput): ValidationResult {
    const results = [
      this.validateString(input.title, '會議標題', true),
      this.validateString(input.description, '會議描述', false, this.config.maxTextLength),
      this.validateDate(input.scheduledDate, '預定日期', true),
      this.validateString(input.location, '會議地點', false),
      this.validateString(input.participants?.join(', ') || '', '參與者', false),
    ];

    return this.mergeResults(...results);
  }

  /**
   * 驗證 ID 格式
   */
  validateId(id: string, fieldName: string = 'ID'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!id || id.trim().length === 0) {
      errors.push(`${fieldName} 不能為空`);
    } else if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      errors.push(`${fieldName} 只能包含字母、數字、下劃線和連字符`);
    } else if (id.length > 100) {
      errors.push(`${fieldName} 長度不能超過 100 個字符`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 驗證批量操作輸入
   */
  validateBatchInput<T>(items: T[], validator: (item: T) => ValidationResult, maxItems = 100): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!items || items.length === 0) {
      errors.push('批量操作項目不能為空');
      return { isValid: false, errors, warnings };
    }

    if (items.length > maxItems) {
      errors.push(`批量操作項目數量不能超過 ${maxItems} 個`);
      return { isValid: false, errors, warnings };
    }

    items.forEach((item, index) => {
      const result = validator(item);
      if (!result.isValid) {
        errors.push(`項目 ${index + 1}: ${result.errors.join(', ')}`);
      }
      warnings.push(...result.warnings.map(w => `項目 ${index + 1}: ${w}`));
    });

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 清理和標準化輸入
   */
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim();
    }
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    return input;
  }

  /**
   * 檢查數據庫操作權限
   */
  validateDatabaseOperation(operation: string, userId?: string, resourceId?: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!userId) {
      errors.push('用戶 ID 不能為空');
    }

    if (!operation) {
      errors.push('操作類型不能為空');
    }

    const allowedOperations = ['create', 'read', 'update', 'delete', 'batch'];
    if (!allowedOperations.includes(operation.toLowerCase())) {
      errors.push(`不支持的操作類型: ${operation}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }
}

// 導出單例實例
export const databaseValidation = new DatabaseValidation();

// 導出配置
export type { ValidationConfig, ValidationResult };

