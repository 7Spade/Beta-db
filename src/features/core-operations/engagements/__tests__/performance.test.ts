/**
 * @fileoverview 性能測試文件
 * 測試所有數據庫操作的性能和效率
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

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Database Operation Performance', () => {
    test('創建 Engagement 應該在合理時間內完成', async () => {
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
      };

      mockFirestore.collection.mockReturnValue({});
      mockFirestore.addDoc.mockResolvedValue({ id: 'test-id' });

      const startTime = performance.now();
      const result = await service.createEngagement(mockInput);
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('獲取 Engagement 應該在合理時間內完成', async () => {
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

      const startTime = performance.now();
      const result = await service.getEngagement('test-id');
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // 應該在 500ms 內完成
    });

    test('更新 Engagement 應該在合理時間內完成', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updateInput = {
        name: '更新的專案名稱',
        status: '進行中' as const,
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const startTime = performance.now();
      const result = await service.updateEngagement('test-id', updateInput);
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // 應該在 500ms 內完成
    });

    test('批量更新應該在合理時間內完成', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updates = Array.from({ length: 100 }, (_, i) => ({
        id: `id-${i}`,
        data: { status: '進行中' as const },
      }));

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      };

      mockFirestore.writeBatch.mockReturnValue(mockBatch);
      mockFirestore.doc.mockReturnValue({});

      const startTime = performance.now();
      const result = await service.batchUpdateEngagements(updates);
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(2000); // 應該在 2 秒內完成
    });
  });

  describe('Large Data Handling', () => {
    test('應該能處理大量任務數據', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const largeEngagement = {
        id: 'test-id',
        name: '大型專案',
        tasks: Array.from({ length: 1000 }, (_, i) => ({
          id: `task-${i}`,
          title: `任務 ${i}`,
          description: `任務描述 ${i}`,
          value: 1000 + i,
          quantity: 1,
          unitPrice: 1000 + i,
          discount: 0,
          status: '待處理',
          completedQuantity: 0,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system',
          subTasks: [],
          attachments: [],
          comments: [],
          tags: [],
        })),
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'test-id',
        data: () => largeEngagement,
      });

      const startTime = performance.now();
      const result = await service.getEngagement('test-id');
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(result.engagement?.tasks).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('應該能處理大量財務記錄', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const payments = Array.from({ length: 500 }, (_, i) => ({
        id: `payment-${i}`,
        description: `付款 ${i}`,
        amount: 1000 + i,
        status: '已付款',
        requestDate: new Date(),
        paidDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      }));

      const receipts = Array.from({ length: 300 }, (_, i) => ({
        id: `receipt-${i}`,
        description: `收款 ${i}`,
        amount: 2000 + i,
        status: '已收款',
        requestDate: new Date(),
        receivedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      }));

      const invoices = Array.from({ length: 200 }, (_, i) => ({
        id: `invoice-${i}`,
        invoiceNumber: `INV-${i}`,
        amount: 5000 + i,
        taxAmount: 500 + i,
        totalAmount: 5500 + i,
        status: '已付款',
        issueDate: new Date(),
        dueDate: new Date(),
        paidDate: new Date(),
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      }));

      const startTime = performance.now();
      const summary = service.calculateFinancialSummary(1000000, payments, receipts, invoices);
      const endTime = performance.now();

      expect(summary.totalValue).toBe(1000000);
      expect(summary.paidAmount).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });

    test('應該能處理大量文件數據', async () => {
      const { DocumentService } = require('../services/document.service');
      const service = new DocumentService();

      const documents = Array.from({ length: 1000 }, (_, i) => ({
        id: `doc-${i}`,
        title: `文件 ${i}`,
        type: 'contract',
        version: '1.0',
        status: 'published',
        fileSize: 1024 + i,
        fileUrl: `https://example.com/file-${i}.pdf`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      }));

      const attachments = Array.from({ length: 500 }, (_, i) => ({
        id: `att-${i}`,
        fileName: `attachment-${i}.pdf`,
        fileType: 'application/pdf',
        fileSize: 2048 + i,
        fileUrl: `https://example.com/attachment-${i}.pdf`,
        uploadedAt: new Date(),
        createdBy: 'system',
      }));

      const startTime = performance.now();
      const summary = service.calculateDocumentSummary(documents, attachments);
      const endTime = performance.now();

      expect(summary.totalDocuments).toBe(1000);
      expect(summary.totalSize).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });
  });

  describe('Concurrent Operations', () => {
    test('應該能處理並發創建操作', async () => {
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
      };

      mockFirestore.collection.mockReturnValue({});
      mockFirestore.addDoc.mockResolvedValue({ id: 'test-id' });

      const startTime = performance.now();
      const promises = Array.from({ length: 10 }, () => service.createEngagement(mockInput));
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results.every(result => result.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(2000); // 應該在 2 秒內完成
    });

    test('應該能處理並發讀取操作', async () => {
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

      const startTime = performance.now();
      const promises = Array.from({ length: 20 }, () => service.getEngagement('test-id'));
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results.every(result => result.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('應該能處理並發更新操作', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const updateInput = {
        name: '更新的專案名稱',
        status: '進行中' as const,
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.updateDoc.mockResolvedValue(undefined);

      const startTime = performance.now();
      const promises = Array.from({ length: 5 }, () => service.updateEngagement('test-id', updateInput));
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results.every(result => result.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });
  });

  describe('Memory Usage', () => {
    test('應該有效管理內存使用', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const initialMemory = process.memoryUsage().heapUsed;

      // 創建大量數據
      const largeEngagement = {
        id: 'test-id',
        name: '大型專案',
        tasks: Array.from({ length: 10000 }, (_, i) => ({
          id: `task-${i}`,
          title: `任務 ${i}`,
          value: 1000 + i,
        })),
      };

      mockFirestore.doc.mockReturnValue({});
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'test-id',
        data: () => largeEngagement,
      });

      const result = await service.getEngagement('test-id');
      const finalMemory = process.memoryUsage().heapUsed;

      expect(result.success).toBe(true);
      expect(result.engagement?.tasks).toHaveLength(10000);
      
      // 內存使用應該在合理範圍內
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 應該少於 100MB
    });

    test('應該正確釋放內存', async () => {
      const { FinancialService } = require('../services/financial.service');
      const service = new FinancialService();

      const initialMemory = process.memoryUsage().heapUsed;

      // 創建大量財務數據
      const payments = Array.from({ length: 10000 }, (_, i) => ({
        id: `payment-${i}`,
        description: `付款 ${i}`,
        amount: 1000 + i,
        status: '已付款',
      }));

      const receipts = Array.from({ length: 5000 }, (_, i) => ({
        id: `receipt-${i}`,
        description: `收款 ${i}`,
        amount: 2000 + i,
        status: '已收款',
      }));

      const invoices = Array.from({ length: 2000 }, (_, i) => ({
        id: `invoice-${i}`,
        invoiceNumber: `INV-${i}`,
        amount: 5000 + i,
        status: '已付款',
        totalAmount: 5500 + i,
      }));

      // 執行計算
      const summary = service.calculateFinancialSummary(10000000, payments, receipts, invoices);

      // 強制垃圾回收
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;

      expect(summary.totalValue).toBe(10000000);
      
      // 內存使用應該在合理範圍內
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 應該少於 50MB
    });
  });

  describe('Query Performance', () => {
    test('應該能高效查詢大量 Engagements', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockEngagements = Array.from({ length: 1000 }, (_, i) => ({
        id: `engagement-${i}`,
        name: `專案 ${i}`,
        contractor: '測試承包商',
        client: '測試客戶',
        totalValue: 100000 + i,
        status: '進行中',
        phase: '執行',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockFirestore.query.mockReturnValue({});
      mockFirestore.getDocs.mockResolvedValue({
        docs: mockEngagements.map(engagement => ({
          id: engagement.id,
          data: () => engagement,
        })),
      });

      const startTime = performance.now();
      const result = await service.getEngagements({ limit: 100 });
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(result.engagements?.length).toBeLessThanOrEqual(100);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    test('應該能高效篩選 Engagements', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      const mockEngagements = Array.from({ length: 500 }, (_, i) => ({
        id: `engagement-${i}`,
        name: `專案 ${i}`,
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

      mockFirestore.query.mockReturnValue({});
      mockFirestore.getDocs.mockResolvedValue({
        docs: mockEngagements
          .filter(engagement => engagement.status === '進行中')
          .map(engagement => ({
            id: engagement.id,
            data: () => engagement,
          })),
      });

      const startTime = performance.now();
      const result = await service.getEngagements({ status: '進行中' });
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(result.engagements?.length).toBeLessThanOrEqual(250);
      expect(endTime - startTime).toBeLessThan(500); // 應該在 500ms 內完成
    });
  });

  describe('Validation Performance', () => {
    test('應該能快速驗證大量輸入', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const validInput = {
        name: '測試專案',
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const startTime = performance.now();
      
      // 執行大量驗證
      for (let i = 0; i < 1000; i++) {
        const result = databaseValidation.validateCreateEngagementInput(validInput);
        expect(result.isValid).toBe(true);
      }
      
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });

    test('應該能快速驗證任務輸入', () => {
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

      const startTime = performance.now();
      
      // 執行大量驗證
      for (let i = 0; i < 1000; i++) {
        const result = databaseValidation.validateCreateTaskInput(validInput);
        expect(result.isValid).toBe(true);
      }
      
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });
  });

  describe('Error Handling Performance', () => {
    test('應該能快速處理錯誤', async () => {
      const { EngagementService } = require('../services/engagement.service');
      const service = new EngagementService();

      mockFirestore.getDoc.mockImplementation(() => {
        throw new Error('數據庫錯誤');
      });

      const startTime = performance.now();
      const result = await service.getEngagement('test-id');
      const endTime = performance.now();

      expect(result.success).toBe(false);
      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });

    test('應該能快速處理驗證錯誤', () => {
      const { databaseValidation } = require('../utils/database-validation.utils');

      const invalidInput = {
        name: '', // 無效輸入
        contractor: '測試承包商',
        client: '測試客戶',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 100000,
        currency: 'TWD',
      };

      const startTime = performance.now();
      const result = databaseValidation.validateCreateEngagementInput(invalidInput);
      const endTime = performance.now();

      expect(result.isValid).toBe(false);
      expect(endTime - startTime).toBeLessThan(10); // 應該在 10ms 內完成
    });
  });
});
