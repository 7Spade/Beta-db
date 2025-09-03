/**
 * @fileoverview 綜合數據庫測試文件
 * 測試所有數據庫交互的完整性、安全性和性能
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

describe('Comprehensive Database Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Complete Engagement Lifecycle', () => {
        test('應該能完整執行 Engagement 生命週期', async () => {
            const { EngagementService } = require('../services/engagement.service');
            const { FinancialService } = require('../services/financial.service');
            const { DocumentService } = require('../services/document.service');
            const { databaseValidation } = require('../utils/database-validation.utils');

            const engagementService = new EngagementService();
            const financialService = new FinancialService();
            const documentService = new DocumentService();

            // 1. 創建 Engagement
            const createInput = {
                name: '完整測試專案',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 1000000,
                currency: 'TWD',
                description: '這是一個完整的測試專案',
            };

            // 驗證輸入
            const validation = databaseValidation.validateCreateEngagementInput(createInput);
            expect(validation.isValid).toBe(true);

            mockFirestore.collection.mockReturnValue({} as any);
            mockFirestore.addDoc.mockResolvedValue({ id: 'engagement-123' } as any);

            const createResult = await engagementService.createEngagement(createInput);
            expect(createResult.success).toBe(true);
            expect(createResult.engagementId).toBe('engagement-123');

            // 2. 添加任務
            const taskInput = {
                title: '測試任務',
                description: '任務描述',
                priority: '中' as const,
                quantity: 10,
                unitPrice: 5000,
                discount: 0,
                dueDate: new Date('2024-06-30'),
            };

            const taskValidation = databaseValidation.validateCreateTaskInput(taskInput);
            expect(taskValidation.isValid).toBe(true);

            // 3. 添加付款記錄
            const paymentInput = {
                description: '首期付款',
                amount: 300000,
                requestDate: new Date(),
            };

            const paymentValidation = databaseValidation.validateCreatePaymentInput(paymentInput);
            expect(paymentValidation.isValid).toBe(true);

            mockFirestore.doc.mockReturnValue({} as any);
            mockFirestore.updateDoc.mockResolvedValue(undefined as any);

            const paymentResult = await financialService.addPayment('engagement-123', paymentInput);
            expect(paymentResult.success).toBe(true);

            // 4. 添加文件
            const documentInput = {
                title: '專案合約',
                type: 'contract' as const,
                fileSize: 1024000,
                fileUrl: 'https://example.com/contract.pdf',
                fileName: 'contract.pdf',
                mimeType: 'application/pdf',
                accessLevel: 'confidential' as const,
            };

            const documentValidation = databaseValidation.validateCreateDocumentInput(documentInput);
            expect(documentValidation.isValid).toBe(true);

            const documentResult = await documentService.addDocument('engagement-123', documentInput);
            expect(documentResult.success).toBe(true);

            // 5. 更新 Engagement 狀態
            const updateInput = {
                status: '進行中' as const,
                phase: '執行' as const,
            };

            const updateValidation = databaseValidation.validateUpdateEngagementInput(updateInput);
            expect(updateValidation.isValid).toBe(true);

            const updateResult = await engagementService.updateEngagement('engagement-123', updateInput);
            expect(updateResult.success).toBe(true);

            // 6. 獲取 Engagement 詳情
            const mockEngagement = {
                id: 'engagement-123',
                name: '完整測試專案',
                contractor: '測試承包商',
                client: '測試客戶',
                totalValue: 1000000,
                status: '進行中',
                phase: '執行',
                tasks: [],
                payments: [],
                receipts: [],
                invoices: [],
                documents: [],
                attachments: [],
            };

            mockFirestore.getDoc.mockResolvedValue({
                exists: () => true,
                id: 'engagement-123',
                data: () => mockEngagement,
            } as any);

            const getResult = await engagementService.getEngagement('engagement-123');
            expect(getResult.success).toBe(true);
            expect(getResult.engagement?.name).toBe('完整測試專案');

            // 7. 計算財務摘要
            const payments = [
                { status: '已付款', amount: 300000 },
                { status: '待處理', amount: 200000 },
            ];

            const receipts = [
                { status: '已收款', amount: 250000 },
            ];

            const invoices = [
                { status: '已付款', totalAmount: 300000 },
            ];

            const financialSummary = financialService.calculateFinancialSummary(
                1000000,
                payments,
                receipts,
                invoices
            );

            expect(financialSummary.totalValue).toBe(1000000);
            expect(financialSummary.paidAmount).toBe(300000);
            expect(financialSummary.pendingAmount).toBe(200000);

            // 8. 刪除 Engagement
            mockFirestore.deleteDoc.mockResolvedValue(undefined as any);

            const deleteResult = await engagementService.deleteEngagement('engagement-123');
            expect(deleteResult.success).toBe(true);
        });
    });

    describe('Data Consistency Tests', () => {
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
            };

            mockFirestore.collection.mockReturnValue({} as any);
            mockFirestore.addDoc.mockResolvedValue({ id: 'engagement-456' } as any);

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
            } as any);

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

        test('應該正確處理並發更新', async () => {
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

    describe('Error Recovery Tests', () => {
        test('應該能從數據庫錯誤中恢復', async () => {
            const { EngagementService } = require('../services/engagement.service');

            const engagementService = new EngagementService();

            // 第一次調用失敗
            mockFirestore.getDoc.mockRejectedValueOnce(new Error('網絡錯誤') as any);

            const firstResult = await engagementService.getEngagement('engagement-error');
            expect(firstResult.success).toBe(false);

            // 第二次調用成功
            mockFirestore.getDoc.mockResolvedValue({
                exists: () => true,
                id: 'engagement-error',
                data: () => ({ name: '恢復測試專案' }),
            } as any);

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
                commit: jest.fn().mockImplementation(() => Promise.reject(new Error('部分更新失敗'))),
            } as any;

            mockFirestore.writeBatch.mockReturnValue(mockBatch as any);
            mockFirestore.doc.mockReturnValue({} as any);

            const result = await engagementService.batchUpdateEngagements(updates);

            expect(result.success).toBe(false);
            expect(result.error).toContain('批量更新失敗');
        });
    });

    describe('Performance Under Load', () => {
        test('應該能處理高負載操作', async () => {
            const { EngagementService } = require('../services/engagement.service');
            const { databaseValidation } = require('../utils/database-validation.utils');

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
                };

                // 驗證輸入
                const validation = databaseValidation.validateCreateEngagementInput(input);
                expect(validation.isValid).toBe(true);

                mockFirestore.collection.mockReturnValue({} as any);
                mockFirestore.addDoc.mockResolvedValue({ id: `engagement-${i}` } as any);

                return engagementService.createEngagement(input);
            });

            const createResults = await Promise.all(createPromises);
            const createEndTime = performance.now();

            expect(createResults.every(result => result.success)).toBe(true);
            expect(createEndTime - startTime).toBeLessThan(5000); // 應該在 5 秒內完成

            // 並發讀取操作
            const readStartTime = performance.now();
            const readPromises = Array.from({ length: 100 }, (_, i) => {
                mockFirestore.doc.mockReturnValue({} as any);
                mockFirestore.getDoc.mockResolvedValue({
                    exists: () => true,
                    id: `engagement-${i}`,
                    data: () => ({ name: `高負載測試專案 ${i}` }),
                } as any);

                return engagementService.getEngagement(`engagement-${i}`);
            });

            const readResults = await Promise.all(readPromises);
            const readEndTime = performance.now();

            expect(readResults.every(result => result.success)).toBe(true);
            expect(readEndTime - readStartTime).toBeLessThan(3000); // 應該在 3 秒內完成
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
            } as any);

            const startTime = performance.now();
            const result = await engagementService.getEngagements({ limit: 100 });
            const endTime = performance.now();

            expect(result.success).toBe(true);
            expect(result.engagements?.length).toBeLessThanOrEqual(100);
            expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
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
                },
                {
                    name: "'; DROP TABLE engagements; --",
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 100000,
                    currency: 'TWD',
                },
                {
                    name: '${process.env.SECRET_KEY}',
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 100000,
                    currency: 'TWD',
                },
                {
                    name: 'a'.repeat(10000), // 超長輸入
                    contractor: '測試承包商',
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
                    totalValue: Number.MAX_SAFE_INTEGER + 1, // 數值溢出
                    currency: 'TWD',
                },
                {
                    name: '測試專案',
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: -1000000, // 負數
                    currency: 'TWD',
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
                },
                {
                    name: 'a'.repeat(200), // 最大長度
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 1000000000, // 最大值
                    currency: 'TWD',
                },
                {
                    name: 'a'.repeat(201), // 超過最大長度
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 1000000001, // 超過最大值
                    currency: 'TWD',
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

    describe('Integration with External Systems', () => {
        test('應該正確處理通知系統集成', async () => {
            const { NotificationService } = require('../services/notification.service');

            const notificationService = new NotificationService();

            const mockEngagement = {
                id: 'engagement-notification',
                name: '通知測試專案',
                endDate: new Date('2024-12-31'),
                currency: 'TWD',
            };

            // 測試狀態變更通知
            const statusResult = await notificationService.sendStatusChangeNotification(
                mockEngagement,
                '草稿',
                '進行中',
                'user-123'
            );

            expect(statusResult.success).toBe(true);

            // 測試階段變更通知
            const phaseResult = await notificationService.sendPhaseChangeNotification(
                mockEngagement,
                '規劃',
                '執行',
                'user-123'
            );

            expect(phaseResult.success).toBe(true);

            // 測試截止日期提醒
            const deadlineResult = await notificationService.sendDeadlineReminder(
                mockEngagement,
                'user-123',
                7
            );

            expect(deadlineResult.success).toBe(true);
        });

        test('應該正確處理文件系統集成', async () => {
            const { DocumentService } = require('../services/document.service');

            const documentService = new DocumentService();

            const documents = [
                {
                    id: 'doc-1',
                    title: '合約文件',
                    type: 'contract' as const,
                    status: 'published' as const,
                    fileSize: 1024000,
                    createdAt: new Date(),
                },
                {
                    id: 'doc-2',
                    title: '技術規格',
                    type: 'specification' as const,
                    status: 'draft' as const,
                    fileSize: 2048000,
                    createdAt: new Date(),
                },
            ];

            const attachments = [
                {
                    id: 'att-1',
                    fileName: 'attachment1.pdf',
                    fileSize: 512000,
                    uploadedAt: new Date(),
                },
            ];

            const summary = documentService.calculateDocumentSummary(documents, attachments);

            expect(summary.totalDocuments).toBe(2);
            expect(summary.publishedDocuments).toBe(1);
            expect(summary.draftDocuments).toBe(1);
            expect(summary.totalSize).toBe(3584000); // 1024000 + 2048000 + 512000
        });
    });
});
