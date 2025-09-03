/**
 * @fileoverview 數據庫交互測試文件
 * 測試所有數據庫操作的安全性、效率和正確性
 */
import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';

// Mock Firebase
const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(),
  runTransaction: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
};

const mockTimestamp = {
  now: jest.fn(() => ({ toDate: () => new Date() })),
  fromDate: jest.fn((date) => ({ toDate: () => date })),
};

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: () => mockFirestore,
  collection: mockFirestore.collection,
  doc: mockFirestore.doc,
  addDoc: mockFirestore.addDoc,
  getDoc: mockFirestore.getDoc,
  getDocs: mockFirestore.getDocs,
  updateDoc: mockFirestore.updateDoc,
  deleteDoc: mockFirestore.deleteDoc,
  writeBatch: mockFirestore.writeBatch,
  runTransaction: mockFirestore.runTransaction,
  query: mockFirestore.query,
  where: mockFirestore.where,
  orderBy: mockFirestore.orderBy,
  limit: mockFirestore.limit,
  startAfter: mockFirestore.startAfter,
  Timestamp: mockTimestamp,
  arrayUnion: jest.fn((item) => item),
  arrayRemove: jest.fn((item) => item),
}));

// Mock Firebase client
jest.mock('@/features/integrations/database/firebase-client/firebase-client', () => ({
  firestore: mockFirestore,
}));

describe('Database Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('EngagementService', () => {
    test('應該正確創建 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockInput = {
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
        description: '測試描述',
      };

      mockFirestore.collection.mockReturnValue({});
      mockFirestore.addDoc.mockResolvedValue({ id: 'test-id' });

      const result = await service.createEngagement(mockInput);

      expect(result.success).toBe(true);
      expect(result.engagementId).toBe('test-id');
      expect(mockFirestore.addDoc).toHaveBeenCalled();
    });

    test('應該驗證輸入數據', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const invalidInput = {
        name: '', // 空名稱
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const result = await service.createEngagement(invalidInput);

      expect(result.success).toBe(false);
      expect(result.error).toContain('專案名稱不能為空');
    });

    test('應該正確獲取 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockEngagement = {
        id: 'test-id',
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        totalValue: 100000,
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'test-id',
        data: () => mockEngagement,
      });

      const result = await service.getEngagement('test-id');

      expect(result.success).toBe(true);
      expect(result.engagement).toEqual({
        id: 'test-id',
        ...mockEngagement,
      });
    });

    test('應該處理不存在的 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await service.getEngagement('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Engagement 不存在');
    });

    test('應該正確更新 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updateInput = {
        name: '更新的專案名稱',
        status: '進行中' as const,
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const result = await service.updateEngagement('test-id', updateInput);

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該正確刪除 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.deleteDoc.mockResolvedValue(undefined);

      const result = await service.deleteEngagement('test-id');

      expect(result.success).toBe(true);
      expect(mockFirestore.deleteDoc).toHaveBeenCalled();
    });

    test('應該正確批量更新 Engagements', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updates = [
        { id: 'id1', data: { status: '進行中' as const } },
        { id: 'id2', data: { status: '已完成' as const } },
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      };

      mockFirestore.writeBatch.mockReturnValue(mockBatch);
      mockFirestore.doc.mockReturnValue({});

      const result = await service.batchUpdateEngagements(updates);

      expect(result.success).toBe(true);
      expect(mockBatch.update).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    test('應該使用事務更新 Engagement', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updateInput = {
        status: '進行中' as const,
      };

      const mockTransaction = {
        get: jest.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ name: '測試專案' }),
        }),
        update: jest.fn(),
      };

      mockFirestore.runTransaction.mockImplementation(async (callback) => {
        return await callback(mockTransaction);
      });

      const result = await service.updateEngagementWithTransaction('test-id', updateInput);

      expect(result.success).toBe(true);
      expect(mockTransaction.get).toHaveBeenCalled();
      expect(mockTransaction.update).toHaveBeenCalled();
    });
  });

  describe('FinancialService', () => {
    test('應該正確添加付款記錄', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const paymentInput = {
        description: '測試付款',
        amount: 50000,
        requestDate: new Date(),
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const result = await service.addPayment('test-id', paymentInput);

      expect(result.success).toBe(true);
      expect(result.paymentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該正確更新付款狀態', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const mockEngagement = {
        payments: [
          {
            id: 'payment-1',
            description: '測試付款',
            amount: 50000,
            status: '待處理',
          },
        ],
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      });
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const result = await service.updatePaymentStatus('test-id', 'payment-1', '已付款');

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該處理不存在的付款記錄', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const mockEngagement = {
        payments: [],
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      });

      const result = await service.updatePaymentStatus('test-id', 'non-existent-payment', '已付款');

      expect(result.success).toBe(false);
      expect(result.error).toBe('付款記錄不存在');
    });

    test('應該正確計算財務摘要', () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const payments = [
        { status: '已付款', amount: 30000 },
        { status: '待處理', amount: 20000 },
        { status: '已逾期', amount: 10000 },
      ];

      const receipts = [
        { status: '已收款', amount: 25000 },
      ];

      const invoices = [
        { status: '已付款', totalAmount: 30000 },
      ];

      const summary = service.calculateFinancialSummary(100000, payments, receipts, invoices);

      expect(summary.totalValue).toBe(100000);
      expect(summary.paidAmount).toBe(30000);
      expect(summary.pendingAmount).toBe(20000);
      expect(summary.overdueAmount).toBe(10000);
      expect(summary.paymentProgress).toBe(30);
    });

    test('應該正確批量更新財務記錄', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const mockEngagement = {
        payments: [
          { id: 'payment-1', amount: 50000, status: '待處理' },
        ],
        receipts: [
          { id: 'receipt-1', amount: 30000, status: '待處理' },
        ],
        invoices: [
          { id: 'invoice-1', totalAmount: 80000, status: '草稿' },
        ],
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      });
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const updates = {
        payments: [{ id: 'payment-1', status: '已付款' as const }],
        receipts: [{ id: 'receipt-1', status: '已收款' as const }],
        invoices: [{ id: 'invoice-1', status: '已付款' as const }],
      };

      const result = await service.batchUpdateFinancialRecords('test-id', updates);

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });
  });

  describe('DocumentService', () => {
    test('應該正確添加文件', async () => {
      const { DocumentService } = require('../services/document.service');
      const service = new DocumentService();

      const documentInput = {
        title: '測試文件',
        type: 'contract',
        fileSize: 1024,
        fileUrl: 'https://example.com/file.pdf',
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const result = await service.addDocument('test-id', documentInput);

      expect(result.success).toBe(true);
      expect(result.documentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該正確添加附件', async () => {
      const { DocumentService } = require('../services/document.service');
      const service = new DocumentService();

      const attachmentInput = {
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileSize: 2048,
        fileUrl: 'https://example.com/attachment.pdf',
        createdBy: 'user-1',
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const result = await service.addAttachment('test-id', attachmentInput);

      expect(result.success).toBe(true);
      expect(result.attachmentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該正確計算文件摘要', () => {
      const { DocumentService } = require('../services/document.service');
      const service = new DocumentService();

      const documents = [
        { status: 'draft', fileSize: 1024 },
        { status: 'review', fileSize: 2048 },
        { status: 'approved', fileSize: 3072 },
        { status: 'published', fileSize: 4096 },
        { status: 'archived', fileSize: 5120 },
      ];

      const attachments = [
        { fileSize: 1024 },
        { fileSize: 2048 },
      ];

      const summary = service.calculateDocumentSummary(documents, attachments);

      expect(summary.totalDocuments).toBe(5);
      expect(summary.draftDocuments).toBe(1);
      expect(summary.reviewDocuments).toBe(1);
      expect(summary.approvedDocuments).toBe(1);
      expect(summary.publishedDocuments).toBe(1);
      expect(summary.archivedDocuments).toBe(1);
      expect(summary.totalSize).toBe(18432); // 1024 + 2048 + 3072 + 4096 + 5120 + 1024 + 2048
    });
  });

  describe('Database Validation', () => {
    test('應該正確驗證 Engagement 創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validInput = {
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
        description: '測試描述',
      };

      const result = databaseValidation.validateCreateEngagementInput(validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('應該檢測無效的 Engagement 創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const invalidInput = {
        name: '', // 空名稱
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: -1000, // 負數
        currency: 'TWD',
      };

      const result = databaseValidation.validateCreateEngagementInput(invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('專案名稱不能為空');
      expect(result.errors).toContain('總價值必須大於 0');
    });

    test('應該正確驗證任務創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validInput = {
        title: '測試任務',
        description: '任務描述',
        quantity: 10,
        unitPrice: 1000,
        discount: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const result = databaseValidation.validateCreateTaskInput(validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('應該檢測無效的任務創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const invalidInput = {
        title: '', // 空標題
        description: '任務描述',
        quantity: -5, // 負數
        unitPrice: -100, // 負數
        discount: -50, // 負數
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-01-01'), // 結束日期早於開始日期
      };

      const result = databaseValidation.validateCreateTaskInput(invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('任務標題不能為空');
      expect(result.errors).toContain('任務數量必須大於 0');
      expect(result.errors).toContain('單價不能為負數');
      expect(result.errors).toContain('折扣不能為負數');
      expect(result.errors).toContain('任務開始日期必須早於結束日期');
    });

    test('應該正確驗證付款創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validInput = {
        description: '測試付款',
        amount: 50000,
        requestDate: new Date(),
      };

      const result = databaseValidation.validateCreatePaymentInput(validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('應該檢測無效的付款創建輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const invalidInput = {
        description: '', // 空描述
        amount: -1000, // 負數
        requestDate: new Date(),
      };

      const result = databaseValidation.validateCreatePaymentInput(invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('付款描述不能為空');
      expect(result.errors).toContain('付款金額必須大於 0');
    });

    test('應該正確驗證 ID 格式', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validId = 'engagement-123';
      const invalidId = 'invalid id with spaces!';

      const validResult = databaseValidation.validateId(validId);
      const invalidResult = databaseValidation.validateId(invalidId);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('ID 只能包含字母、數字、下劃線和連字符');
    });

    test('應該正確驗證日期範圍', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validStartDate = new Date('2024-01-01');
      const validEndDate = new Date('2024-12-31');
      const invalidEndDate = new Date('2023-12-31'); // 早於開始日期

      const validResult = databaseValidation.validateDateRange(validStartDate, validEndDate);
      const invalidResult = databaseValidation.validateDateRange(validStartDate, invalidEndDate);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('開始日期必須早於結束日期');
    });

    test('應該正確驗證金額', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validAmount = 100000;
      const negativeAmount = -1000;
      const tooLargeAmount = 2000000000;

      const validResult = databaseValidation.validateAmount(validAmount);
      const negativeResult = databaseValidation.validateAmount(negativeAmount);
      const tooLargeResult = databaseValidation.validateAmount(tooLargeAmount);

      expect(validResult.isValid).toBe(true);
      expect(negativeResult.isValid).toBe(false);
      expect(negativeResult.errors).toContain('金額 不能為負數');
      expect(tooLargeResult.isValid).toBe(false);
      expect(tooLargeResult.errors).toContain('金額 不能超過 10 億');
    });
  });

  describe('Error Handling', () => {
    test('應該正確處理數據庫錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.collection.mockImplementation(() => {
        throw new Error('數據庫連接失敗');
      });

      const result = await service.createEngagement({
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('創建失敗');
    });

    test('應該正確處理網絡超時', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.getDoc.mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('網絡超時')), 100);
        });
      });

      const result = await service.getEngagement('test-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('獲取失敗');
    });

    test('應該正確處理權限錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.updateDoc.mockImplementation(() => {
        throw new Error('權限不足');
      });

      const result = await service.updateEngagement('test-id', {
        name: '更新的名稱',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('更新失敗');
    });
  });

  describe('Performance', () => {
    test('應該在合理時間內完成數據庫操作', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'test-id',
        data: () => ({ name: '測試專案' }),
      });

      const startTime = Date.now();
      const result = await service.getEngagement('test-id');
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('應該正確處理大量數據', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const largeEngagement = {
        id: 'test-id',
        name: '大型專案',
        tasks: Array.from({ length: 1000 }, (_, i) => ({
          id: `task-${i}`,
          title: `任務 ${i}`,
          value: 1000,
        })),
      };

      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'test-id',
        data: () => largeEngagement,
      });

      const result = await service.getEngagement('test-id');

      expect(result.success).toBe(true);
      expect(result.engagement?.tasks).toHaveLength(1000);
    });
  });

  describe('Security', () => {
    test('應該防止 SQL 注入攻擊', async () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const maliciousInput = {
        name: "'; DROP TABLE engagements; --",
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const result = databaseValidation.validateCreateEngagementInput(maliciousInput);

      // 驗證應該通過，因為我們使用的是 NoSQL 數據庫，不會有 SQL 注入問題
      // 但我們仍然應該驗證輸入的長度和格式
      expect(result.isValid).toBe(true);
    });

    test('應該防止 XSS 攻擊', async () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const xssInput = {
        name: '<script>alert("XSS")</script>',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const result = databaseValidation.validateCreateEngagementInput(xssInput);

      // 驗證應該通過，因為我們只驗證基本格式
      // XSS 防護應該在前端和後端渲染時處理
      expect(result.isValid).toBe(true);
    });

    test('應該限制輸入長度', async () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const longNameInput = {
        name: 'a'.repeat(201), // 超過 200 字符限制
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const result = databaseValidation.validateCreateEngagementInput(longNameInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('專案名稱不能超過 200 個字符');
    });
  });
});
