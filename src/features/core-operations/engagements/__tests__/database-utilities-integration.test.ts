/**
 * @fileoverview 數據庫工具集成測試
 * 測試所有數據庫工具如何協同工作，包括修復、並發控制、驗證等
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { CreateEngagementInput } from '../types';
import {
    concurrencyManager,
    LockType,
    withConcurrencyControl,
    withReadLock,
    withWriteLock
} from '../utils/concurrency-control.utils';
import {
    databaseRepairManager
} from '../utils/database-repair.utils';
import {
    errorHandler
} from '../utils/error-handling.utils';
import {
    performanceManager,
    withCache,
    withPerformanceMonitoring,
} from '../utils/performance.utils';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
    Timestamp: {
        now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
        fromDate: jest.fn((date: Date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
    },
}));

describe('數據庫工具集成測試', () => {
    beforeEach(() => {
        // 清理所有狀態
        databaseRepairManager.clearRepairLog();
        performanceManager.clearCache();
        performanceManager.clearPerformanceLog();
        concurrencyManager.cleanup();
        jest.clearAllMocks();
    });

    afterEach(() => {
        // 清理測試數據
        databaseRepairManager.clearRepairLog();
        performanceManager.clearCache();
        performanceManager.clearPerformanceLog();
        concurrencyManager.cleanup();
    });

    describe('完整數據庫操作流程測試', () => {
        it('應該成功執行帶所有保護的 Engagement 創建操作', async () => {
            const mockInput: CreateEngagementInput = {
                name: '集成測試項目',
                description: '測試所有工具集成',
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
                engagementId: 'integration-test-id',
            });

            // 使用並發控制執行修復操作
            const result = await withConcurrencyControl(
                'engagement-create',
                LockType.WRITE,
                'user-1',
                'createEngagement',
                () => databaseRepairManager.repairCreateEngagement(mockInput, mockOperation)
            );

            expect(result.success).toBe(true);
            expect(result.data?.data?.engagementId).toBe('integration-test-id');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該處理並發創建操作', async () => {
            const mockInput: CreateEngagementInput = {
                name: '並發測試項目',
                description: '測試並發創建',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 100000,
                currency: 'TWD',
                scope: '測試範圍',
            };

            const results: Array<{ success: boolean; data?: any; error?: string }> = [];

            // 啟動多個並發創建操作
            const promises = Array.from({ length: 3 }, (_, i) =>
                withConcurrencyControl(
                    'engagement-create',
                    LockType.WRITE,
                    `user-${i}`,
                    'createEngagement',
                    () => databaseRepairManager.repairCreateEngagement(
                        { ...mockInput, name: `${mockInput.name}-${i}` },
                        jest.fn().mockResolvedValue({
                            success: true,
                            engagementId: `concurrent-test-id-${i}`,
                        })
                    )
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有操作都應該成功（因為並發控制會序列化寫操作）
            expect(results).toHaveLength(3);
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.data?.data?.engagementId).toBe(`concurrent-test-id-${i}`);
            });
        });

        it('應該在驗證失敗時阻止操作執行', async () => {
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

            const result = await withConcurrencyControl(
                'engagement-create',
                LockType.WRITE,
                'user-1',
                'createEngagement',
                () => databaseRepairManager.repairCreateEngagement(
                    invalidInput as CreateEngagementInput,
                    mockOperation
                )
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('驗證失敗');
            expect(mockOperation).not.toHaveBeenCalled();
        });

        it('應該在操作失敗時正確釋放鎖', async () => {
            const mockInput: CreateEngagementInput = {
                name: '失敗測試項目',
                description: '測試失敗處理',
                contractor: '測試承包商',
                client: '測試客戶',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                totalValue: 100000,
                currency: 'TWD',
                scope: '測試範圍',
            };

            const mockOperation = jest.fn().mockResolvedValue({
                success: false,
                error: '數據庫連接失敗',
            });

            const result = await withConcurrencyControl(
                'engagement-create',
                LockType.WRITE,
                'user-1',
                'createEngagement',
                () => databaseRepairManager.repairCreateEngagement(mockInput, mockOperation)
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('數據庫連接失敗');

            // 驗證鎖已被釋放（可以執行新的操作）
            const newResult = await withConcurrencyControl(
                'engagement-create',
                LockType.WRITE,
                'user-2',
                'createEngagement',
                () => databaseRepairManager.repairCreateEngagement(
                    { ...mockInput, name: '新項目' },
                    jest.fn().mockResolvedValue({
                        success: true,
                        engagementId: 'new-engagement-id',
                    })
                )
            );

            expect(newResult.success).toBe(true);
        });
    });

    describe('讀寫操作集成測試', () => {
        it('應該允許多個讀操作並發執行', async () => {
            const results: Array<{ success: boolean; data?: any }> = [];

            // 啟動多個並發讀操作
            const promises = Array.from({ length: 5 }, (_, i) =>
                withReadLock(
                    'engagement-read',
                    `user-${i}`,
                    'getEngagement',
                    () => databaseRepairManager.repairGetEngagement(
                        `engagement-${i}`,
                        jest.fn().mockResolvedValue({
                            success: true,
                            engagement: { id: `engagement-${i}`, name: `項目-${i}` },
                        })
                    )
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有讀操作都應該成功
            expect(results).toHaveLength(5);
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.data?.data?.engagement?.id).toBe(`engagement-${i}`);
            });
        });

        it('應該序列化寫操作', async () => {
            const results: Array<{ success: boolean; data?: any }> = [];
            const executionOrder: number[] = [];

            // 啟動多個並發寫操作
            const promises = Array.from({ length: 3 }, (_, i) =>
                withWriteLock(
                    'engagement-update',
                    `user-${i}`,
                    'updateEngagement',
                    () => {
                        executionOrder.push(i);
                        return databaseRepairManager.repairUpdateEngagement(
                            `engagement-${i}`,
                            { name: `更新項目-${i}` },
                            jest.fn().mockResolvedValue({ success: true })
                        );
                    }
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有寫操作都應該成功
            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result.success).toBe(true);
            });

            // 寫操作應該序列化執行
            expect(executionOrder).toHaveLength(3);
        });

        it('應該阻止讀寫操作混合執行', async () => {
            // 啟動一個寫操作
            const writePromise = withWriteLock(
                'engagement-mixed',
                'user-1',
                'updateEngagement',
                () => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(databaseRepairManager.repairUpdateEngagement(
                                'engagement-1',
                                { name: '更新項目' },
                                jest.fn().mockResolvedValue({ success: true })
                            ));
                        }, 100);
                    });
                }
            );

            // 等待寫操作開始
            await new Promise(resolve => setTimeout(resolve, 50));

            // 嘗試啟動讀操作（應該等待寫操作完成）
            const readPromise = withReadLock(
                'engagement-mixed',
                'user-2',
                'getEngagement',
                () => databaseRepairManager.repairGetEngagement(
                    'engagement-1',
                    jest.fn().mockResolvedValue({
                        success: true,
                        engagement: { id: 'engagement-1', name: '項目' },
                    })
                )
            );

            const [writeResult, readResult] = await Promise.all([writePromise, readPromise]);

            expect(writeResult.success).toBe(true);
            expect(readResult.success).toBe(true);
        });
    });

    describe('性能監控集成測試', () => {
        it('應該監控並發操作的性能', async () => {
            const results: Array<{ success: boolean; data?: any }> = [];

            // 啟動多個並發操作
            const promises = Array.from({ length: 3 }, (_, i) =>
                withConcurrencyControl(
                    'performance-test',
                    LockType.READ,
                    `user-${i}`,
                    'performanceOperation',
                    () => withPerformanceMonitoring(
                        'performanceOperation',
                        () => new Promise(resolve => {
                            setTimeout(() => {
                                resolve(databaseRepairManager.repairGetEngagement(
                                    `engagement-${i}`,
                                    jest.fn().mockResolvedValue({
                                        success: true,
                                        engagement: { id: `engagement-${i}` },
                                    })
                                ));
                            }, 50);
                        })
                    )
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有操作都應該成功
            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result.success).toBe(true);
            });

            // 檢查性能統計
            const perfStats = performanceManager.getPerformanceStatistics();
            expect(perfStats.totalOperations).toBeGreaterThanOrEqual(3);
        });

        it('應該使用緩存提高重複操作的性能', async () => {
            const mockOperation = jest.fn().mockResolvedValue({
                success: true,
                engagement: { id: 'cached-engagement', name: '緩存項目' },
            });

            // 第一次調用
            const result1 = await withCache(
                'engagement-cache-test',
                () => databaseRepairManager.repairGetEngagement(
                    'cached-engagement',
                    mockOperation
                ),
                5000
            );

            // 第二次調用（應該使用緩存）
            const result2 = await withCache(
                'engagement-cache-test',
                () => databaseRepairManager.repairGetEngagement(
                    'cached-engagement',
                    mockOperation
                ),
                5000
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(mockOperation).toHaveBeenCalledTimes(1); // 只調用一次
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

        it('應該在操作失敗時提供適當的錯誤恢復建議', async () => {
            const timeoutError = new Error('Request timeout');
            const result = errorHandler.analyzeError(timeoutError, { operation: 'test' });

            expect(result.recovery).toBeDefined();
            expect(result.recovery?.suggestions).toContain('檢查網絡連接');
        });

        it('應該在並發操作中正確處理錯誤', async () => {
            const results: Array<{ success: boolean; error?: string }> = [];

            // 啟動多個操作，其中一些會失敗
            const promises = Array.from({ length: 5 }, (_, i) =>
                withConcurrencyControl(
                    'error-test',
                    LockType.READ,
                    `user-${i}`,
                    'errorOperation',
                    () => {
                        if (i % 2 === 0) {
                            return Promise.reject(new Error(`操作 ${i} 失敗`));
                        }
                        return Promise.resolve({ success: true, data: `結果-${i}` });
                    }
                ).then(
                    result => results.push(result),
                    error => results.push({ success: false, error: error.message })
                )
            );

            await Promise.all(promises);

            // 檢查結果
            expect(results).toHaveLength(5);
            results.forEach((result, i) => {
                if (i % 2 === 0) {
                    expect(result.success).toBe(false);
                    expect(result.error).toContain(`操作 ${i} 失敗`);
                } else {
                    expect(result.success).toBe(true);
                }
            });
        });
    });

    describe('統計和監控集成測試', () => {
        it('應該收集所有工具的統計信息', async () => {
            // 執行一些操作
            await withConcurrencyControl(
                'stats-test',
                LockType.WRITE,
                'user-1',
                'statsOperation',
                () => databaseRepairManager.repairCreateEngagement(
                    {
                        name: '統計測試項目',
                        description: '測試統計收集',
                        contractor: '測試承包商',
                        client: '測試客戶',
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2024-12-31'),
                        totalValue: 100000,
                        currency: 'TWD',
                        scope: '測試範圍',
                    },
                    jest.fn().mockResolvedValue({
                        success: true,
                        engagementId: 'stats-test-id',
                    })
                )
            );

            // 收集統計信息
            const repairStats = databaseRepairManager.getRepairStatistics();
            const perfStats = performanceManager.getPerformanceStatistics();
            const cacheStats = performanceManager.getCacheStatistics();
            const concurrencyStats = concurrencyManager.getConcurrencyStatistics();

            expect(repairStats.totalOperations).toBeGreaterThan(0);
            expect(perfStats.totalOperations).toBeGreaterThan(0);
            expect(cacheStats.size).toBeGreaterThanOrEqual(0);
            expect(concurrencyStats.lockStatistics.totalLocks).toBeGreaterThanOrEqual(0);
        });

        it('應該生成完整的集成報告', async () => {
            // 執行一些操作
            await withConcurrencyControl(
                'report-test',
                LockType.READ,
                'user-1',
                'reportOperation',
                () => databaseRepairManager.repairGetEngagement(
                    'report-engagement',
                    jest.fn().mockResolvedValue({
                        success: true,
                        engagement: { id: 'report-engagement' },
                    })
                )
            );

            const repairReport = databaseRepairManager.generateRepairReport();
            const healthCheck = await databaseRepairManager.healthCheck();

            expect(repairReport).toContain('數據庫修復報告');
            expect(healthCheck.status).toBeDefined();
            expect(['healthy', 'warning', 'critical']).toContain(healthCheck.status);
        });
    });

    describe('極限情況測試', () => {
        it('應該處理大量並發操作', async () => {
            const results: Array<{ success: boolean; data?: any }> = [];

            // 啟動大量並發讀操作
            const promises = Array.from({ length: 20 }, (_, i) =>
                withReadLock(
                    'massive-concurrent',
                    `user-${i}`,
                    'massiveOperation',
                    () => databaseRepairManager.repairGetEngagement(
                        `engagement-${i}`,
                        jest.fn().mockResolvedValue({
                            success: true,
                            engagement: { id: `engagement-${i}` },
                        })
                    )
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有操作都應該成功
            expect(results).toHaveLength(20);
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.data?.data?.engagement?.id).toBe(`engagement-${i}`);
            });
        });

        it('應該處理長時間運行的操作', async () => {
            const startTime = Date.now();

            const result = await withConcurrencyControl(
                'long-running',
                LockType.WRITE,
                'user-1',
                'longOperation',
                () => new Promise(resolve => {
                    setTimeout(() => {
                        resolve(databaseRepairManager.repairUpdateEngagement(
                            'long-engagement',
                            { name: '長時間更新' },
                            jest.fn().mockResolvedValue({ success: true })
                        ));
                    }, 200);
                })
            );

            const duration = Date.now() - startTime;

            expect(result.success).toBe(true);
            expect(duration).toBeGreaterThanOrEqual(200);
        });

        it('應該處理資源耗盡的情況', async () => {
            const lockManager = new (require('../utils/concurrency-control.utils').ResourceLockManager)({
                maxLocksPerResource: 2,
            });

            // 獲取最大數量的鎖
            const result1 = await lockManager.acquireLock(
                'limited-resource',
                LockType.READ,
                'user-1',
                'operation-1'
            );

            const result2 = await lockManager.acquireLock(
                'limited-resource',
                LockType.READ,
                'user-2',
                'operation-2'
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);

            // 嘗試獲取超過限制的鎖
            const result3 = await lockManager.acquireLock(
                'limited-resource',
                LockType.READ,
                'user-3',
                'operation-3',
                100
            );

            expect(result3.success).toBe(false);

            // 清理
            await lockManager.releaseLock(result1.data!.id, 'user-1');
            await lockManager.releaseLock(result2.data!.id, 'user-2');
            lockManager.cleanup();
        });
    });
});
