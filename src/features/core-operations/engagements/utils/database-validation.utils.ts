/**
 * @fileoverview 數據庫操作驗證工具
 */
import type { Timestamp } from 'firebase/firestore';
import type {
  CreateEngagementInput,
  UpdateEngagementInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreatePaymentInput,
  CreateReceiptInput,
  CreateInvoiceInput,
  CreateCommunicationInput,
  CreateMeetingInput,
  CreateDocumentInput,
  CreateAttachmentInput,
} from '../types';

/**
 * 驗證結果介面
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 數據庫驗證工具類
 */
export class DatabaseValidationUtils {
  /**
   * 驗證 Engagement 創建輸入
   */
  static validateCreateEngagementInput(input: CreateEngagementInput): ValidationResult {
    const errors: string[] = [];

    // 基本字段驗證
    if (!input.name || input.name.trim().length === 0) {
      errors.push('專案名稱不能為空');
    } else if (input.name.length > 200) {
      errors.push('專案名稱不能超過 200 個字符');
    }

    if (!input.contractor || input.contractor.trim().length === 0) {
      errors.push('承包商不能為空');
    }

    if (!input.client || input.client.trim().length === 0) {
      errors.push('客戶不能為空');
    }

    // 日期驗證
    if (!input.startDate) {
      errors.push('開始日期不能為空');
    }

    if (!input.endDate) {
      errors.push('結束日期不能為空');
    }

    if (input.startDate && input.endDate && input.startDate >= input.endDate) {
      errors.push('開始日期必須早於結束日期');
    }

    // 財務驗證
    if (input.totalValue <= 0) {
      errors.push('總價值必須大於 0');
    }

    if (input.totalValue > 1000000000) {
      errors.push('總價值不能超過 10 億');
    }

    if (!input.currency || input.currency.trim().length === 0) {
      errors.push('貨幣不能為空');
    }

    // 描述長度驗證
    if (input.description && input.description.length > 2000) {
      errors.push('描述不能超過 2000 個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證 Engagement 更新輸入
   */
  static validateUpdateEngagementInput(input: UpdateEngagementInput): ValidationResult {
    const errors: string[] = [];

    // 名稱驗證
    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        errors.push('專案名稱不能為空');
      } else if (input.name.length > 200) {
        errors.push('專案名稱不能超過 200 個字符');
      }
    }

    // 日期驗證
    if (input.startDate && input.endDate && input.startDate >= input.endDate) {
      errors.push('開始日期必須早於結束日期');
    }

    // 財務驗證
    if (input.totalValue !== undefined) {
      if (input.totalValue <= 0) {
        errors.push('總價值必須大於 0');
      }
      if (input.totalValue > 1000000000) {
        errors.push('總價值不能超過 10 億');
      }
    }

    // 描述長度驗證
    if (input.description && input.description.length > 2000) {
      errors.push('描述不能超過 2000 個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證任務創建輸入
   */
  static validateCreateTaskInput(input: CreateTaskInput): ValidationResult {
    const errors: string[] = [];

    if (!input.title || input.title.trim().length === 0) {
      errors.push('任務標題不能為空');
    } else if (input.title.length > 200) {
      errors.push('任務標題不能超過 200 個字符');
    }

    if (input.quantity <= 0) {
      errors.push('任務數量必須大於 0');
    }

    if (input.unitPrice < 0) {
      errors.push('單價不能為負數');
    }

    if (input.discount !== undefined && input.discount < 0) {
      errors.push('折扣不能為負數');
    }

    if (input.dueDate && input.dueDate instanceof Date && input.dueDate < new Date()) {
      errors.push('截止日期不能早於今天');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證任務更新輸入
   */
  static validateUpdateTaskInput(input: UpdateTaskInput): ValidationResult {
    const errors: string[] = [];

    if (input.title !== undefined) {
      if (!input.title || input.title.trim().length === 0) {
        errors.push('任務標題不能為空');
      } else if (input.title.length > 200) {
        errors.push('任務標題不能超過 200 個字符');
      }
    }

    if (input.quantity !== undefined && input.quantity <= 0) {
      errors.push('任務數量必須大於 0');
    }

    if (input.unitPrice !== undefined && input.unitPrice < 0) {
      errors.push('單價不能為負數');
    }

    if (input.discount !== undefined && input.discount < 0) {
      errors.push('折扣不能為負數');
    }

    if (input.completedQuantity !== undefined && input.completedQuantity < 0) {
      errors.push('已完成數量不能為負數');
    }

    if (input.dueDate && input.dueDate instanceof Date && input.dueDate < new Date()) {
      errors.push('截止日期不能早於今天');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證付款創建輸入
   */
  static validateCreatePaymentInput(input: CreatePaymentInput): ValidationResult {
    const errors: string[] = [];

    if (!input.description || input.description.trim().length === 0) {
      errors.push('付款描述不能為空');
    }

    if (input.amount <= 0) {
      errors.push('付款金額必須大於 0');
    }

    if (input.amount > 1000000000) {
      errors.push('付款金額不能超過 10 億');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證收款創建輸入
   */
  static validateCreateReceiptInput(input: CreateReceiptInput): ValidationResult {
    const errors: string[] = [];

    if (!input.description || input.description.trim().length === 0) {
      errors.push('收款描述不能為空');
    }

    if (input.amount <= 0) {
      errors.push('收款金額必須大於 0');
    }

    if (input.amount > 1000000000) {
      errors.push('收款金額不能超過 10 億');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證發票創建輸入
   */
  static validateCreateInvoiceInput(input: CreateInvoiceInput): ValidationResult {
    const errors: string[] = [];

    if (!input.invoiceNumber || input.invoiceNumber.trim().length === 0) {
      errors.push('發票號碼不能為空');
    }

    if (input.amount <= 0) {
      errors.push('發票金額必須大於 0');
    }

    if (input.amount > 1000000000) {
      errors.push('發票金額不能超過 10 億');
    }

    if (input.taxAmount !== undefined && input.taxAmount < 0) {
      errors.push('稅額不能為負數');
    }

    if (!input.dueDate) {
      errors.push('到期日期不能為空');
    }

    if (input.items && input.items.length === 0) {
      errors.push('發票項目不能為空');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證溝通記錄創建輸入
   */
  static validateCreateCommunicationInput(input: CreateCommunicationInput): ValidationResult {
    const errors: string[] = [];

    if (!input.type || input.type.trim().length === 0) {
      errors.push('溝通類型不能為空');
    }

    if (!input.content || input.content.trim().length === 0) {
      errors.push('溝通內容不能為空');
    } else if (input.content.length > 5000) {
      errors.push('溝通內容不能超過 5000 個字符');
    }

    if (!input.participants || input.participants.length === 0) {
      errors.push('參與者不能為空');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證會議創建輸入
   */
  static validateCreateMeetingInput(input: CreateMeetingInput): ValidationResult {
    const errors: string[] = [];

    if (!input.title || input.title.trim().length === 0) {
      errors.push('會議標題不能為空');
    }

    if (!input.scheduledDate) {
      errors.push('會議日期不能為空');
    }

    if (!input.participants || input.participants.length === 0) {
      errors.push('參與者不能為空');
    }

    if (input.duration && input.duration <= 0) {
      errors.push('會議時長必須大於 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證文件創建輸入
   */
  static validateCreateDocumentInput(input: CreateDocumentInput): ValidationResult {
    const errors: string[] = [];

    if (!input.title || input.title.trim().length === 0) {
      errors.push('文件標題不能為空');
    }

    if (!input.type || input.type.trim().length === 0) {
      errors.push('文件類型不能為空');
    }

    if (input.fileSize && input.fileSize <= 0) {
      errors.push('文件大小必須大於 0');
    }

    if (input.fileSize && input.fileSize > 100 * 1024 * 1024) { // 100MB
      errors.push('文件大小不能超過 100MB');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證附件創建輸入
   */
  static validateCreateAttachmentInput(input: CreateAttachmentInput): ValidationResult {
    const errors: string[] = [];

    if (!input.fileName || input.fileName.trim().length === 0) {
      errors.push('文件名不能為空');
    }

    if (!input.mimeType || input.mimeType.trim().length === 0) {
      errors.push('文件類型不能為空');
    }

    if (input.fileSize <= 0) {
      errors.push('文件大小必須大於 0');
    }

    if (input.fileSize > 100 * 1024 * 1024) { // 100MB
      errors.push('文件大小不能超過 100MB');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證 ID 格式
   */
  static validateId(id: string, fieldName: string = 'ID'): ValidationResult {
    const errors: string[] = [];

    if (!id || id.trim().length === 0) {
      errors.push(`${fieldName} 不能為空`);
    } else if (id.length > 100) {
      errors.push(`${fieldName} 不能超過 100 個字符`);
    } else if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      errors.push(`${fieldName} 只能包含字母、數字、下劃線和連字符`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證日期範圍
   */
  static validateDateRange(startDate: Date | Timestamp, endDate: Date | Timestamp): ValidationResult {
    const errors: string[] = [];

    if (!startDate) {
      errors.push('開始日期不能為空');
    }

    if (!endDate) {
      errors.push('結束日期不能為空');
    }

    if (startDate && endDate) {
      const start = startDate instanceof Date ? startDate : startDate.toDate();
      const end = endDate instanceof Date ? endDate : endDate.toDate();
      
      if (start >= end) {
        errors.push('開始日期必須早於結束日期');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證金額
   */
  static validateAmount(amount: number, fieldName: string = '金額'): ValidationResult {
    const errors: string[] = [];

    if (amount < 0) {
      errors.push(`${fieldName} 不能為負數`);
    }

    if (amount > 1000000000) {
      errors.push(`${fieldName} 不能超過 10 億`);
    }

    if (!Number.isFinite(amount)) {
      errors.push(`${fieldName} 必須是有效數字`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證字符串長度
   */
  static validateStringLength(
    value: string | undefined,
    fieldName: string,
    maxLength: number,
    required: boolean = false
  ): ValidationResult {
    const errors: string[] = [];

    if (required && (!value || value.trim().length === 0)) {
      errors.push(`${fieldName} 不能為空`);
    }

    if (value && value.length > maxLength) {
      errors.push(`${fieldName} 不能超過 ${maxLength} 個字符`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * 導出驗證工具實例
 */
export const databaseValidation = DatabaseValidationUtils;
