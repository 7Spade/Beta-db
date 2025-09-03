/**
 * @fileoverview 修復驗證測試文件
 * 驗證所有數據庫交互修復是否正確實施
 */
import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';

// Mock Firebase
const mockFirestore = {
  collection: jest.fn() as jest.MockedFunction<any>,
  doc: jest.fn() as jest.MockedFunction<any>,
  addDoc: jest.fn() as jest.MockedFunction<any>,
  getDoc: jest.fn() as jest.MockedFunction<any>,
  getDocs: jest.fn() as jest.MockedFunction<any>,
  updateDoc: jest.fn() as jest.MockedFunction<any>,
  deleteDoc: jest.fn() as jest.MockedFunction<any>,
  writeBatch: jest.fn() as jest.MockedFunction<any>,
  runTransaction: jest.fn() as jest.MockedFunction<any>,
  query: jest.fn() as jest.MockedFunction<any>,
  where: jest.fn() as jest.MockedFunction<any>,
  orderBy: jest.fn() as jest.MockedFunction<any>,
  limit: jest.fn() as jest.MockedFunction<any>,
  startAfter: jest.fn() as jest.MockedFunction<any>,
};

const mockTimestamp = {
  now: jest.fn(() => ({ toDate: () => new Date() })),
  fromDate: jest.fn((date) => ({ toDate: () => date })),
};

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
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

describe('Fix Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('EngagementService 修復驗證', () => {
    test('應該有 validateEngagementInput 方法', () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();
      
      // 檢查私有方法是否存在（通過反射）
      const privateMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(privateMethods).toContain('validateEngagementInput');
    });

    test('應該有 updateEngagementWithTransaction 方法', () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(methods).toContain('updateEngagementWithTransaction');
    });

    test('應該正確驗證 Engagement 輸入', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      // 測試無效輸入
      const invalidInputs = [
        {
          name: '',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
        },
        {
          name: '測試專案',
          contractor: '',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
        },
        {
          name: '測試專案',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: -100000,
          currency: 'TWD',
        },
        {
          name: '測試專案',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-12-31'),
          endDate: new Date('2024-01-01'),
          totalValue: 100000,
          currency: 'TWD',
        },
      ];

      for (const input of invalidInputs) {
        const result = await service.createEngagement(input);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    test('應該支持事務更新', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockTransaction = jest.fn();
      mockFirestore.runTransaction.mockImplementation(mockTransaction as any);

      const updateInput = {
        status: '進行中' as const,
        phase: '執行' as const,
      };

      const additionalUpdates = {
        lastModifiedBy: 'user-123',
      };

      const result = await service.updateEngagementWithTransaction(
        'engagement-123',
        updateInput,
        additionalUpdates
      );

      expect(mockFirestore.runTransaction).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('FinancialService 修復驗證', () => {
    test('應該有 updatePaymentStatus 方法', () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(methods).toContain('updatePaymentStatus');
    });

    test('應該有 updateReceiptStatus 方法', () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(methods).toContain('updateReceiptStatus');
    });

    test('應該有 updateInvoiceStatus 方法', () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(methods).toContain('updateInvoiceStatus');
    });

    test('應該有 batchUpdateFinancialRecords 方法', () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
      expect(methods).toContain('batchUpdateFinancialRecords');
    });

    test('應該正確更新付款狀態', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const mockEngagement = {
        payments: [
          { id: 'payment-1', status: '待處理', amount: 100000 },
          { id: 'payment-2', status: '待處理', amount: 200000 },
        ],
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await service.updatePaymentStatus(
        'engagement-123',
        'payment-1',
        '已付款',
        new Date()
      );

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    test('應該正確批量更新財務記錄', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const mockEngagement = {
        payments: [{ id: 'payment-1', status: '待處理' }],
        receipts: [{ id: 'receipt-1', status: '待處理' }],
        invoices: [{ id: 'invoice-1', status: '待處理' }],
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const updates = {
        payments: [{ id: 'payment-1', status: '已付款' as const }],
        receipts: [{ id: 'receipt-1', status: '已收款' as const }],
        invoices: [{ id: 'invoice-1', status: '已付款' as const }],
      };

      const result = await service.batchUpdateFinancialRecords('engagement-123', updates);

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });
  });

  describe('Actions 修復驗證', () => {
    test('應該有正確的 updateReceiptStatusAction', async () => {
      const { updateReceiptStatusAction } = require('../actions/financial.actions');

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          receipts: [{ id: 'receipt-1', status: '待處理' }],
        }),
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await updateReceiptStatusAction(
        'engagement-123',
        'receipt-1',
        '已收款',
        new Date()
      );

      expect(result.success).toBe(true);
    });

    test('應該有正確的 updateInvoiceStatusAction', async () => {
      const { updateInvoiceStatusAction } = require('../actions/financial.actions');

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          invoices: [{ id: 'invoice-1', status: '待處理' }],
        }),
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await updateInvoiceStatusAction(
        'engagement-123',
        'invoice-1',
        '已付款',
        new Date()
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Database Validation Utils 修復驗證', () => {
    test('應該有所有必要的驗證函數', () => {
      const databaseValidation = require('../utils/database-validation.utils');

      const expectedFunctions = [
        'validateCreateEngagementInput',
        'validateUpdateEngagementInput',
        'validateCreateTaskInput',
        'validateUpdateTaskInput',
        'validateCreatePaymentInput',
        'validateCreateReceiptInput',
        'validateCreateInvoiceInput',
        'validateCreateCommunicationInput',
        'validateCreateMeetingInput',
        'validateCreateDocumentInput',
        'validateCreateAttachmentInput',
      ];

      expectedFunctions.forEach(funcName => {
        expect(databaseValidation[funcName]).toBeDefined();
        expect(typeof databaseValidation[funcName]).toBe('function');
      } as any);
    });

    test('應該正確驗證各種輸入類型', () => {
      const databaseValidation = require('../utils/database-validation.utils');

      // 測試 Engagement 驗證
      const validEngagement = {
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const engagementResult = databaseValidation.validateCreateEngagementInput(validEngagement);
      expect(engagementResult.isValid).toBe(true);
      expect(engagementResult.errors).toHaveLength(0);

      // 測試 Task 驗證
      const validTask = {
        title: '測試任務',
        description: '任務描述',
        priority: '中' as const,
        quantity: 10,
        unitPrice: 5000,
        discount: 0,
        dueDate: new Date('2024-06-30'),
      };

      const taskResult = databaseValidation.validateCreateTaskInput(validTask);
      expect(taskResult.isValid).toBe(true);
      expect(taskResult.errors).toHaveLength(0);

      // 測試 Payment 驗證
      const validPayment = {
        description: '測試付款',
        amount: 100000,
        requestDate: new Date(),
      };

      const paymentResult = databaseValidation.validateCreatePaymentInput(validPayment);
      expect(paymentResult.isValid).toBe(true);
      expect(paymentResult.errors).toHaveLength(0);
    });

    test('應該正確捕獲驗證錯誤', () => {
      const databaseValidation = require('../utils/database-validation.utils');

      // 測試無效的 Engagement 輸入
      const invalidEngagement = {
        name: '',
        contractor: '',
        client: '',
        startDate: new Date('2024-12-31'),
        endDate: new Date('2024-01-01'),
        totalValue: -100000,
        currency: '',
      };

      const engagementResult = databaseValidation.validateCreateEngagementInput(invalidEngagement);
      expect(engagementResult.isValid).toBe(false);
      expect(engagementResult.errors.length).toBeGreaterThan(0);

      // 測試無效的 Task 輸入
      const invalidTask = {
        title: '',
        description: '任務描述',
        priority: '中' as const,
        quantity: -10,
        unitPrice: -5000,
        discount: -100,
        dueDate: new Date('2020-01-01'),
      };

      const taskResult = databaseValidation.validateCreateTaskInput(invalidTask);
      expect(taskResult.isValid).toBe(false);
      expect(taskResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Utils Index 修復驗證', () => {
    test('應該正確導出所有工具函數', () => {
      const utils = require('../utils/index');

      // 檢查是否導出了數據庫驗證工具
      expect(utils.validateCreateEngagementInput).toBeDefined();
      expect(utils.validateUpdateEngagementInput).toBeDefined();
      expect(utils.validateCreateTaskInput).toBeDefined();
      expect(utils.validateCreatePaymentInput).toBeDefined();

      // 檢查其他工具函數
      expect(utils.calculateEngagementProgress).toBeDefined();
      expect(utils.calculateFinancialSummary).toBeDefined();
      expect(utils.formatEngagementStatus).toBeDefined();
    });
  });

  describe('Module Index 修復驗證', () => {
    test('應該正確導出所有模組', () => {
      const module = require('../index');

      // 檢查服務
      expect(module.EngagementService).toBeDefined();
      expect(module.FinancialService).toBeDefined();
      expect(module.DocumentService).toBeDefined();
      expect(module.NotificationService).toBeDefined();

      // 檢查類型
      expect(module.Engagement).toBeDefined();
      expect(module.Task).toBeDefined();
      expect(module.Payment).toBeDefined();
      expect(module.Receipt).toBeDefined();
      expect(module.Invoice).toBeDefined();

      // 檢查工具
      expect(module.databaseValidation).toBeDefined();
      expect(module.engagementUtils).toBeDefined();
      expect(module.financialUtils).toBeDefined();
    });
  });

  describe('錯誤處理修復驗證', () => {
    test('應該正確處理數據庫連接錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      // 模擬數據庫連接錯誤
      mockFirestore.getDoc.mockRejectedValue(new Error('Firebase connection failed'));

      const result = await service.getEngagement('engagement-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Firebase connection failed');
    });

    test('應該正確處理文檔不存在錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      // 模擬文檔不存在
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => false,
      } as any);

      const result = await service.getEngagement('non-existent-engagement');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Engagement 不存在');
    });

    test('應該正確處理驗證錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const invalidInput = {
        name: '',
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
  });

  describe('性能優化修復驗證', () => {
    test('應該支持批量操作', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updates = [
        { id: 'id-1', data: { status: '進行中' as const } },
        { id: 'id-2', data: { status: '已完成' as const } },
        { id: 'id-3', data: { status: '已取消' as const } },
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      };

      mockFirestore.writeBatch.mockReturnValue(mockBatch as any);
      mockFirestore.doc.mockReturnValue({} as any);

      const result = await service.batchUpdateEngagements(updates);

      expect(result.success).toBe(true);
      expect(mockBatch.update).toHaveBeenCalledTimes(3);
      expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    });

    test('應該支持事務操作', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransactionObj = {
          get: jest.fn().mockResolvedValue({
            exists: () => true,
            data: () => ({ name: '測試專案' }),
          }),
          update: jest.fn(),
        };
        return await callback(mockTransactionObj);
      } as any);

      mockFirestore.runTransaction.mockImplementation(mockTransaction as any);

      const result = await service.updateEngagementWithTransaction(
        'engagement-123',
        { status: '進行中' as const }
      );

      expect(result.success).toBe(true);
      expect(mockFirestore.runTransaction).toHaveBeenCalled();
    });
  });
});
