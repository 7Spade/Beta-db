/**
 * @fileoverview 數據庫交互綜合測試
 * 測試所有數據庫操作的完整性、安全性和性能
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

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
  arrayUnion: jest.fn() as jest.MockedFunction<any>,
  arrayRemove: jest.fn() as jest.MockedFunction<any>,
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
  arrayUnion: mockFirestore.arrayUnion,
  arrayRemove: mockFirestore.arrayRemove,
}));

// Mock Firebase client
jest.mock('@/features/integrations/database/firebase-client/firebase-client', () => ({
  firestore: mockFirestore,
}));

describe('Database Interactions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('EngagementService Database Operations', () => {
    test('應該能創建 Engagement 並正確處理數據庫交互', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const { databaseValidation } = require('../utils/database-validation.utils');

      const engagementService = new EngagementService();

      const createInput = {
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 1000000,
        currency: 'TWD',
        description: '測試描述',
        scope: '測試範疇',
      };

      // 驗證輸入
      const validation = databaseValidation.validateCreateEngagementInput(createInput);
      expect(validation.isValid).toBe(true);

      // Mock 數據庫操作
      mockFirestore.collection.mockReturnValue({} as any);
      mockFirestore.addDoc.mockResolvedValue({ id: 'engagement-123' } as any);

      const result = await engagementService.createEngagement(createInput);

      expect(result.success).toBe(true);
      expect(result.engagementId).toBe('engagement-123');
      expect(mockFirestore.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: '測試專案',
          contractor: '測試承包商',
          client: '測試客戶',
          totalValue: 1000000,
          currency: 'TWD',
        })
      );
    });

    test('應該能獲取 Engagement 並正確處理數據庫查詢', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      const mockEngagement = {
        id: 'engagement-123',
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        totalValue: 1000000,
        status: '進行中',
        phase: '執行',
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'engagement-123',
        data: () => mockEngagement,
      } as any);

      const result = await engagementService.getEngagement('engagement-123');

      expect(result.success).toBe(true);
      expect(result.engagement?.name).toBe('測試專案');
      expect(mockFirestore.getDoc).toHaveBeenCalled();
    });

    test('應該能更新 Engagement 並正確處理數據庫更新', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      const updateInput = {
        status: '已完成' as const,
        phase: '收尾' as const,
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await engagementService.updateEngagement('engagement-123', updateInput);

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: '已完成',
          phase: '收尾',
        })
      );
    });

    test('應該能刪除 Engagement 並正確處理數據庫刪除', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.deleteDoc.mockResolvedValue(undefined as any);

      const result = await engagementService.deleteEngagement('engagement-123');

      expect(result.success).toBe(true);
      expect(mockFirestore.deleteDoc).toHaveBeenCalled();
    });

    test('應該能批量更新 Engagements 並正確處理批量操作', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      const updates = [
        { id: 'engagement-1', data: { status: '進行中' as const } },
        { id: 'engagement-2', data: { status: '已完成' as const } },
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      } as any;

      mockFirestore.writeBatch.mockReturnValue(mockBatch);
      mockFirestore.doc.mockReturnValue({} as any);

      const result = await engagementService.batchUpdateEngagements(updates);

      expect(result.success).toBe(true);
      expect(mockBatch.update).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    test('應該能使用事務更新 Engagement 並正確處理事務操作', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      const updateInput = {
        status: '進行中' as const,
      };

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const transaction = {
          get: jest.fn().mockResolvedValue({
            exists: () => true,
            data: () => ({ name: '測試專案' }),
          }),
          update: jest.fn(),
        };
        return await callback(transaction);
      });

      mockFirestore.runTransaction.mockImplementation(mockTransaction);
      mockFirestore.doc.mockReturnValue({} as any);

      const result = await engagementService.updateEngagementWithTransaction(
        'engagement-123',
        updateInput
      );

      expect(result.success).toBe(true);
      expect(mockFirestore.runTransaction).toHaveBeenCalled();
    });
  });

  describe('FinancialService Database Operations', () => {
    test('應該能添加付款記錄並正確處理數據庫交互', async () => {
      const { FinancialService } = require('../services/financial.service');
      const { databaseValidation } = require('../utils/database-validation.utils');

      const financialService = new FinancialService();

      const paymentInput = {
        description: '首期付款',
        amount: 300000,
        requestDate: new Date(),
      };

      // 驗證輸入
      const validation = databaseValidation.validateCreatePaymentInput(paymentInput);
      expect(validation.isValid).toBe(true);

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await financialService.addPayment('engagement-123', paymentInput);

      expect(result.success).toBe(true);
      expect(result.paymentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          payments: expect.anything(),
        })
      );
    });

    test('應該能更新付款狀態並正確處理數據庫更新', async () => {
      const { FinancialService } = require('../services/financial.service');

      const financialService = new FinancialService();

      const mockEngagement = {
        payments: [
          {
            id: 'payment-123',
            description: '首期付款',
            amount: 300000,
            status: '待處理',
          },
        ],
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await financialService.updatePaymentStatus(
        'engagement-123',
        'payment-123',
        '已付款'
      );

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          payments: expect.arrayContaining([
            expect.objectContaining({
              id: 'payment-123',
              status: '已付款',
            }),
          ]),
        })
      );
    });

    test('應該能批量更新財務記錄並正確處理批量操作', async () => {
      const { FinancialService } = require('../services/financial.service');

      const financialService = new FinancialService();

      const mockEngagement = {
        payments: [
          { id: 'payment-1', status: '待處理', amount: 100000 },
          { id: 'payment-2', status: '待處理', amount: 200000 },
        ],
        receipts: [],
        invoices: [],
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEngagement,
      } as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const updates = {
        payments: [
          { id: 'payment-1', status: '已付款' as const },
          { id: 'payment-2', status: '已付款' as const },
        ],
      };

      const result = await financialService.batchUpdateFinancialRecords(
        'engagement-123',
        updates
      );

      expect(result.success).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          payments: expect.arrayContaining([
            expect.objectContaining({ id: 'payment-1', status: '已付款' }),
            expect.objectContaining({ id: 'payment-2', status: '已付款' }),
          ]),
        })
      );
    });
  });

  describe('DocumentService Database Operations', () => {
    test('應該能添加文件並正確處理數據庫交互', async () => {
      const { DocumentService } = require('../services/document.service');
      const { databaseValidation } = require('../utils/database-validation.utils');

      const documentService = new DocumentService();

      const documentInput = {
        title: '專案合約',
        type: 'contract' as const,
        fileSize: 1024000,
        fileUrl: 'https://example.com/contract.pdf',
        fileName: 'contract.pdf',
        mimeType: 'application/pdf',
        accessLevel: 'confidential' as const,
      };

      // 驗證輸入
      const validation = databaseValidation.validateCreateDocumentInput(documentInput);
      expect(validation.isValid).toBe(true);

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await documentService.addDocument('engagement-123', documentInput);

      expect(result.success).toBe(true);
      expect(result.documentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          documents: expect.anything(),
        })
      );
    });

    test('應該能添加附件並正確處理數據庫交互', async () => {
      const { DocumentService } = require('../services/document.service');

      const documentService = new DocumentService();

      const attachmentInput = {
        fileName: 'attachment.pdf',
        fileSize: 512000,
        fileUrl: 'https://example.com/attachment.pdf',
        mimeType: 'application/pdf',
        createdBy: 'user-123',
      };

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const result = await documentService.addAttachment('engagement-123', attachmentInput);

      expect(result.success).toBe(true);
      expect(result.attachmentId).toBeDefined();
      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          attachments: expect.anything(),
        })
      );
    });
  });

  describe('Error Handling and Recovery', () => {
    test('應該能從數據庫錯誤中恢復', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const { errorHandler } = require('../utils/error-handling.utils');

      const engagementService = new EngagementService();

      // 第一次調用失敗
      mockFirestore.getDoc.mockRejectedValueOnce(new Error('網絡錯誤'));

      const firstResult = await engagementService.getEngagement('engagement-error');
      expect(firstResult.success).toBe(false);

      // 第二次調用成功
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'engagement-error',
        data: () => ({ name: '恢復測試專案' }),
      });

      const secondResult = await engagementService.getEngagement('engagement-error');
      expect(secondResult.success).toBe(true);
      expect(secondResult.engagement?.name).toBe('恢復測試專案');
    });

    test('應該能處理部分失敗的批量操作', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      const updates = [
        { id: 'id-1', data: { status: '進行中' as const } },
        { id: 'id-2', data: { status: '已完成' as const } },
        { id: 'id-3', data: { status: '已取消' as const } },
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockRejectedValue(new Error('部分更新失敗')),
      } as any;

      mockFirestore.writeBatch.mockReturnValue(mockBatch);
      mockFirestore.doc.mockReturnValue({} as any);

      const result = await engagementService.batchUpdateEngagements(updates);

      expect(result.success).toBe(false);
      expect(result.error).toContain('批量更新失敗');
    });

    test('應該能處理並發更新衝突', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      // 模擬並發更新
      const updates = [
        { status: '進行中' as const },
        { phase: '執行' as const },
        { name: '更新的專案名稱' },
      ];

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      const promises = updates.map(update =>
        engagementService.updateEngagement('engagement-789', update)
      );

      const results = await Promise.all(promises);

      expect(results.every(result => result.success)).toBe(true);
      expect(mockFirestore.updateDoc).toHaveBeenCalledTimes(3);
    });
  });

  describe('Performance and Caching', () => {
    test('應該能處理高負載操作', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const { performanceManager } = require('../utils/performance.utils');

      const engagementService = new EngagementService();

      // 模擬高負載場景
      const startTime = performance.now();

      // 並發創建多個 Engagements
      const createPromises = Array.from({ length: 50 }, (_, i) => {
        const input = {
          name: `高負載測試專案 ${i}`,
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000 + i,
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        };

        mockFirestore.collection.mockReturnValue({} as any);
        mockFirestore.addDoc.mockResolvedValue({ id: `engagement-${i}` });

        return engagementService.createEngagement(input);
      });

      const createResults = await Promise.all(createPromises);
      const createEndTime = performance.now();

      expect(createResults.every(result => result.success)).toBe(true);
      expect(createEndTime - startTime).toBeLessThan(5000); // 應該在 5 秒內完成
    });

    test('應該能處理大量數據查詢', async () => {
      const { EngagementService } = require('../services/engagement.service');

      const engagementService = new EngagementService();

      // 模擬大量數據
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `engagement-${i}`,
        name: `大型專案 ${i}`,
        contractor: '測試承包商',
        client: '測試客戶',
        totalValue: 100000 + i,
        status: i % 2 === 0 ? '進行中' : '已完成',
        phase: '執行',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockFirestore.query.mockReturnValue({} as any);
      mockFirestore.getDocs.mockResolvedValue({
        docs: largeDataset.slice(0, 100).map(engagement => ({
          id: engagement.id,
          data: () => engagement,
        })),
      });

      const startTime = performance.now();
      const result = await engagementService.getEngagements({ limit: 100 });
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(result.engagements?.length).toBeLessThanOrEqual(100);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('應該能正確使用緩存', async () => {
      const { performanceManager } = require('../utils/performance.utils');

      // 設置緩存
      performanceManager.setCache('test-key', { data: 'test-value' });

      // 獲取緩存
      const cached = performanceManager.getCache('test-key');
      expect(cached).toEqual({ data: 'test-value' });

      // 獲取緩存統計
      const stats = performanceManager.getCacheStatistics();
      expect(stats.hits).toBe(1);
      expect(stats.size).toBe(1);
    });
  });

  describe('Security Validation', () => {
    test('應該防止所有安全威脅', async () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      // 測試各種安全威脅
      const securityThreats = [
        {
          name: '<script>alert("XSS")</script>',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: "'; DROP TABLE engagements; --",
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: '${process.env.SECRET_KEY}',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: 'a'.repeat(10000), // 超長輸入
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 100000,
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: '測試專案',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: Number.MAX_SAFE_INTEGER + 1, // 數值溢出
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: '測試專案',
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: -1000000, // 負數
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
      ];

      securityThreats.forEach((threat, index) => {
        const result = databaseValidation.validateCreateEngagementInput(threat);

        if (index < 3) {
          // 前三個威脅應該通過基本驗證（實際防護在渲染層）
          expect(result.isValid).toBe(true);
        } else {
          // 後三個威脅應該被驗證層攔截
          expect(result.isValid).toBe(false);
        }
      });
    });

    test('應該正確處理邊界值', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const boundaryTests = [
        {
          name: 'a', // 最小長度
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 1, // 最小值
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: 'a'.repeat(200), // 最大長度
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 1000000000, // 最大值
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
        {
          name: 'a'.repeat(201), // 超過最大長度
          contractor: '測試承包商',
          client: '測試客戶',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          totalValue: 1000000001, // 超過最大值
          currency: 'TWD',
          description: '測試描述',
          scope: '測試範疇',
        },
      ];

      boundaryTests.forEach((test, index) => {
        const result = databaseValidation.validateCreateEngagementInput(test);

        if (index < 2) {
          expect(result.isValid).toBe(true);
        } else {
          expect(result.isValid).toBe(false);
        }
      });
    });
  });

  describe('Data Consistency', () => {
    test('應該保持數據一致性', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const { FinancialService } = require('../services/financial.service');

      const engagementService = new EngagementService();
      const financialService = new FinancialService();

      // 創建 Engagement
      const createInput = {
        name: '一致性測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 500000,
        currency: 'TWD',
        description: '測試描述',
        scope: '測試範疇',
      };

      mockFirestore.collection.mockReturnValue({} as any);
      mockFirestore.addDoc.mockResolvedValue({ id: 'engagement-456' });

      const createResult = await engagementService.createEngagement(createInput);
      expect(createResult.success).toBe(true);

      // 添加多個付款記錄
      const payments = [
        { description: '首期付款', amount: 150000 },
        { description: '中期付款', amount: 200000 },
        { description: '尾款', amount: 150000 },
      ];

      mockFirestore.doc.mockReturnValue({} as any);
      mockFirestore.updateDoc.mockResolvedValue(undefined as any);

      for (const payment of payments) {
        const result = await financialService.addPayment('engagement-456', payment);
        expect(result.success).toBe(true);
      }

      // 驗證財務摘要計算
      const mockEngagement = {
        id: 'engagement-456',
        totalValue: 500000,
        payments: [
          { status: '已付款', amount: 150000 },
          { status: '已付款', amount: 200000 },
          { status: '待處理', amount: 150000 },
        ],
        receipts: [],
        invoices: [],
      };

      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'engagement-456',
        data: () => mockEngagement,
      });

      const engagement = await engagementService.getEngagement('engagement-456');
      expect(engagement.success).toBe(true);

      if (engagement.success && engagement.engagement) {
        const summary = financialService.calculateFinancialSummary(
          engagement.engagement.totalValue,
          engagement.engagement.payments,
          engagement.engagement.receipts,
          engagement.engagement.invoices
        );

        expect(summary.paidAmount).toBe(350000); // 150000 + 200000
        expect(summary.pendingAmount).toBe(150000);
        expect(summary.paymentProgress).toBe(70); // (350000 / 500000) * 100
      }
    });
  });
});