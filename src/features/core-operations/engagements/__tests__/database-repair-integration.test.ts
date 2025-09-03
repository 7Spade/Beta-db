/**
 * @fileoverview 數據庫修復工具集成測試
 * 測試所有修復工具如何協同工作
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { CreateEngagementInput } from '../types';
import {
    databaseRepairManager,
    repairEngagementOperation,
    withDatabaseRepair
} from '../utils/database-repair.utils';
import {
    errorHandler
} from '../utils/error-handling.utils';
import {
    performanceManager
} from '../utils/performance.utils';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
    Timestamp: {
        now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
        fromDate: jest.fn((date: Date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
    },
}));

describe('數據庫修復工具集成測試', () => {
    beforeEach(() => {
        // 清理所有狀態
        databaseRepairManager.clearRepairLog();
        performanceManager.clearCache();
        performanceManager.clearPerformanceLog();
        jest.clearAllMocks();
    });

    afterEach(() => {
        // 清理測試數據
        databaseRepairManager.clearRepairLog();
        performanceManager.clearCache();
        performanceManager.clearPerformanceLog();
    });

    describe('完整修復流程測試', () => {
        it('應該成功執行完整的 Engagement 創建修復流程', async () => {
            const mockInput: CreateEngagementInput = {
                name: '測試項目',
                description: '這是一個測試項目',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 100000,
                currency: 'TWD',
                scope: '測試範圍',
            };

            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                engagementId: 'test-engagement-id',
            });

            const result = await databaseRepairManager.repairCreateEngagement(
                mockInput,
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data?.engagementId).toBe('test-engagement-id');
            expect(result.performance).toBeDefined();
            expect(result.performance?.duration).toBeGreaterThan(0);
            expect(result.performance?.cacheHit).toBe(false);
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該處理驗證失敗的情況', async () => {
            const invalidInput = {
                name: '', // 無效：空名稱
                description: '測試描述',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: -1000, // 無效：負數
                currency: 'TWD',
                scope: '測試範圍',
            };

            const mockOperation = jest.fn();

            const result = await databaseRepairManager.repairCreateEngagement(
                invalidInput as CreateEngagementInput,
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('驗證失敗');
            expect(mockOperation).not.toHaveBeenCalled();
        });

        it('應該處理數據庫操作失敗並重試', async () => {
            const mockInput: CreateEngagementInput = {
                name: '測試項目',
                description: '這是一個測試項目',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 100000,
                currency: 'TWD',
                scope: '測試範圍',
            };

            let callCount = 0;
            const mockOperation = jest.fn().mockImplementation(() => {
                callCount++;
                if (callCount < 3) {
                    return Promise.resolve({
                        success: false,
                        error: '臨時數據庫錯誤',
                    });
                }
                return Promise.resolve({
                    success: true,
                    engagementId: 'test-engagement-id',
                });
            });

            const result = await databaseRepairManager.repairCreateEngagement(
                mockInput,
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.retryCount).toBe(2);
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });

        it('應該使用緩存提高性能', async () => {
            const mockInput: CreateEngagementInput = {
                name: '緩存測試項目',
                description: '測試緩存功能',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 100000,
                currency: 'TWD',
                scope: '測試範圍',
            };

            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                engagementId: 'cached-engagement-id',
            });

            // 第一次調用
            const result1 = await databaseRepairManager.repairCreateEngagement(
                mockInput,
                mockOperation
            );

            // 第二次調用（應該使用緩存）
            const result2 = await databaseRepairManager.repairCreateEngagement(
                mockInput,
                mockOperation
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(result1.performance?.cacheHit).toBe(false);
            expect(result2.performance?.cacheHit).toBe(true);
            expect(result2.performance?.duration).toBeLessThan(result1.performance?.duration || 0);
        });
    });

    describe('財務操作修復測試', () => {
        it('應該成功修復添加付款操作', async () => {
            const mockPaymentInput = {
                engagementId: 'test-engagement-id',
                amount: 50000,
                currency: 'TWD',
                paymentMethod: 'bank_transfer',
                description: '首期付款',
                dueDate: new Date('2024-02-01'),
            };

            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                paymentId: 'test-payment-id',
            });

            const result = await databaseRepairManager.repairFinancialOperation(
                'addPayment',
                mockPaymentInput,
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data?.paymentId).toBe('test-payment-id');
        });

        it('應該驗證財務數據並拒絕無效輸入', async () => {
            const invalidPaymentInput = {
                engagementId: 'test-engagement-id',
                amount: -1000, // 無效：負數金額
                currency: 'TWD',
                paymentMethod: 'bank_transfer',
                description: '無效付款',
                dueDate: new Date('2024-02-01'),
            };

            const mockOperation = jest.fn();

            const result = await databaseRepairManager.repairFinancialOperation(
                'addPayment',
                invalidPaymentInput,
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('財務數據驗證失敗');
            expect(mockOperation).not.toHaveBeenCalled();
        });
    });

    describe('文件操作修復測試', () => {
        it('應該成功修復添加文件操作', async () => {
            const mockDocumentInput = {
                engagementId: 'test-engagement-id',
                name: '測試文件.pdf',
                type: 'contract',
                url: 'https://example.com/test.pdf',
                size: 1024000,
                mimeType: 'application/pdf',
            };

            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                documentId: 'test-document-id',
            });

            const result = await databaseRepairManager.repairDocumentOperation(
                'addDocument',
                mockDocumentInput,
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data?.documentId).toBe('test-document-id');
        });

        it('應該驗證文件數據並拒絕無效輸入', async () => {
            const invalidDocumentInput = {
                engagementId: 'test-engagement-id',
                name: '', // 無效：空文件名
                type: 'contract',
                url: 'invalid-url', // 無效：無效URL
                size: -1000, // 無效：負數大小
                mimeType: 'application/pdf',
            };

            const mockOperation = jest.fn();

            const result = await databaseRepairManager.repairDocumentOperation(
                'addDocument',
                invalidDocumentInput,
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('文件數據驗證失敗');
            expect(mockOperation).not.toHaveBeenCalled();
        });
    });

    describe('批量操作修復測試', () => {
        it('應該成功修復批量更新操作', async () => {
            const mockUpdates = [
                { id: 'engagement-1', data: { status: 'in_progress' } },
                { id: 'engagement-2', data: { status: 'completed' } },
                { id: 'engagement-3', data: { status: 'paused' } },
            ];

            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
            });

            const result = await databaseRepairManager.repairBatchUpdate(
                mockUpdates,
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該驗證批量操作並拒絕過大的批次', async () => {
            const largeUpdates = Array.from({ length: 150 }, (_, i) => ({
                id: `engagement-${i}`,
                data: { status: 'in_progress' },
            }));

            const mockOperation = jest.fn();

            const result = await databaseRepairManager.repairBatchUpdate(
                largeUpdates,
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('批量驗證失敗');
            expect(mockOperation).not.toHaveBeenCalled();
        });
    });

    describe('工具函數集成測試', () => {
        it('withDatabaseRepair 應該正確包裝操作', async () => {
            const mockOperation = jest.fn().mockResolvedValue('test-result');

            const result = await withDatabaseRepair(
                'testOperation',
                mockOperation,
                { cacheKey: 'test-cache-key' }
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('test-result');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('repairEngagementOperation 應該根據操作類型調用正確的修復方法', async () => {
            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                engagementId: 'test-id',
            });

            // 測試創建操作
            const createResult = await repairEngagementOperation(
                'create',
                { name: '測試項目', description: '測試描述' },
                mockOperation
            );

            expect(createResult.success).toBe(false); // 因為輸入不完整，驗證會失敗
            expect(createResult.error).toContain('驗證失敗');
        });
    });

    describe('統計和監控測試', () => {
        it('應該正確收集修復統計數據', async () => {
            // 執行一些操作
            const mockOperation1 = jest.fn().mockResolvedValue({
                success: true,
                engagementId: 'test-1',
            });

            const mockOperation2 = jest.fn().mockResolvedValue({
                success: false,
                error: '測試錯誤',
            });

            await databaseRepairManager.repairCreateEngagement(
                {
                    name: '測試項目1',
                    description: '測試描述1',
                    contractor: '承包商1',
                    client: '客戶1',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 100000,
                    currency: 'TWD',
                    scope: '範圍1',
                },
                mockOperation1
            );

            await databaseRepairManager.repairCreateEngagement(
                {
                    name: '測試項目2',
                    description: '測試描述2',
                    contractor: '承包商2',
                    client: '客戶2',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 200000,
                    currency: 'TWD',
                    scope: '範圍2',
                },
                mockOperation2
            );

            const stats = databaseRepairManager.getRepairStatistics();

            expect(stats.totalOperations).toBe(2);
            expect(stats.successRate).toBe(50);
            expect(stats.errorRate).toBe(50);
            expect(stats.operationsByType['createEngagement']).toBe(2);
            expect(stats.recentErrors).toHaveLength(1);
        });

        it('應該生成完整的修復報告', async () => {
            // 執行一些操作以生成數據
            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                engagementId: 'test-id',
            });

            await databaseRepairManager.repairCreateEngagement(
                {
                    name: '報告測試項目',
                    description: '測試報告生成',
                    contractor: '測試承包商',
                    client: '測試客戶',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-12-31'),
                    totalValue: 100000,
                    currency: 'TWD',
                    scope: '測試範圍',
                },
                mockOperation
            );

            const report = databaseRepairManager.generateRepairReport();

            expect(report).toContain('數據庫修復報告');
            expect(report).toContain('修復統計');
            expect(report).toContain('緩存統計');
            expect(report).toContain('性能統計');
            expect(report).toContain('最近錯誤');
        });

        it('應該執行健康檢查並提供建議', async () => {
            const healthCheck = await databaseRepairManager.healthCheck();

            expect(healthCheck.status).toBeDefined();
            expect(['healthy', 'warning', 'critical']).toContain(healthCheck.status);
            expect(Array.isArray(healthCheck.issues)).toBe(true);
            expect(Array.isArray(healthCheck.recommendations)).toBe(true);
        });
    });

    describe('錯誤處理集成測試', () => {
        it('應該正確處理和分類不同類型的錯誤', async () => {
            const networkError = new Error('Network request failed');
            const validationError = new Error('Validation failed');
            const databaseError = new Error('Database connection lost');

            const networkResult = errorHandler.analyzeError(networkError, { operation: 'test' });
            const validationResult = errorHandler.analyzeError(validationError, { operation: 'test' });
            const databaseResult = errorHandler.analyzeError(databaseError, { operation: 'test' });

            expect(networkResult.retryable).toBe(true);
            expect(validationResult.retryable).toBe(false);
            expect(databaseResult.retryable).toBe(true);
        });

        it('應該提供適當的錯誤恢復建議', async () => {
            const timeoutError = new Error('Request timeout');
            const result = errorHandler.analyzeError(timeoutError, { operation: 'test' });

            expect(result.recovery).toBeDefined();
            expect(result.recovery?.suggestions).toContain('檢查網絡連接');
        });
    });

    describe('性能監控集成測試', () => {
        it('應該正確監控操作性能', async () => {
            const slowOperation = jest.fn().mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 'slow-result';
            });

            const result = await withDatabaseRepair(
                'slowOperation',
                slowOperation
            );

            expect(result.success).toBe(true);
            expect(result.performance?.duration).toBeGreaterThan(100);

            const perfStats = performanceManager.getPerformanceStatistics();
            expect(perfStats.totalOperations).toBeGreaterThan(0);
        });

        it('應該識別慢操作', async () => {
            const verySlowOperation = jest.fn().mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                return 'very-slow-result';
            });

            await withDatabaseRepair(
                'verySlowOperation',
                verySlowOperation
            );

            const perfStats = performanceManager.getPerformanceStatistics();
            expect(perfStats.slowOperations).toBeGreaterThan(0);
        });
    });

    describe('緩存集成測試', () => {
        it('應該正確管理緩存生命週期', async () => {
            const mockOperation = jest.fn().mockResolvedValue('cached-result');

            // 第一次調用
            const result1 = await withDatabaseRepair(
                'cacheTest',
                mockOperation,
                { cacheKey: 'test-cache' }
            );

            // 第二次調用（應該使用緩存）
            const result2 = await withDatabaseRepair(
                'cacheTest',
                mockOperation,
                { cacheKey: 'test-cache' }
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(result2.performance?.cacheHit).toBe(true);
            expect(mockOperation).toHaveBeenCalledTimes(1);

            // 清除緩存
            performanceManager.deleteCache('test-cache');

            // 第三次調用（應該重新執行操作）
            const result3 = await withDatabaseRepair(
                'cacheTest',
                mockOperation,
                { cacheKey: 'test-cache' }
            );

            expect(result3.success).toBe(true);
            expect(result3.performance?.cacheHit).toBe(false);
            expect(mockOperation).toHaveBeenCalledTimes(2);
        });
    });
});
