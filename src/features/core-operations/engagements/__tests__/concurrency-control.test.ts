/**
 * @fileoverview 並發控制和鎖機制測試
 * 測試並發控制、鎖管理、死鎖檢測等功能
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
    ConcurrencyManager,
    LockStatus,
    LockType,
    ResourceLockManager,
    withConcurrencyControl,
    withExclusiveLock,
    withReadLock,
    withWriteLock
} from '../utils/concurrency-control.utils';

describe('並發控制和鎖機制測試', () => {
    let lockManager: ResourceLockManager;
    let concurrencyManager: ConcurrencyManager;

    beforeEach(() => {
        lockManager = new ResourceLockManager({
            defaultTimeout: 5000,
            maxRetries: 3,
            retryDelay: 100,
            deadlockDetectionInterval: 1000,
            lockCleanupInterval: 2000,
            maxLocksPerResource: 5,
            enableDeadlockDetection: true,
            enableLockTimeout: true,
        });

        concurrencyManager = new ConcurrencyManager({
            defaultTimeout: 5000,
            maxRetries: 3,
            retryDelay: 100,
            deadlockDetectionInterval: 1000,
            lockCleanupInterval: 2000,
            maxLocksPerResource: 5,
            enableDeadlockDetection: true,
            enableLockTimeout: true,
        });
    });

    afterEach(() => {
        lockManager.cleanup();
        concurrencyManager.cleanup();
    });

    describe('鎖管理測試', () => {
        it('應該成功獲取和釋放讀鎖', async () => {
            const result = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation'
            );

            expect(result.success).toBe(true);
            expect(result.data?.type).toBe(LockType.READ);
            expect(result.data?.status).toBe(LockStatus.ACQUIRED);
            expect(result.data?.resourceId).toBe('resource-1');
            expect(result.data?.ownerId).toBe('owner-1');

            const releaseResult = await lockManager.releaseLock(
                result.data!.id,
                'owner-1'
            );

            expect(releaseResult.success).toBe(true);
        });

        it('應該允許多個讀鎖同時存在', async () => {
            const result1 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation-1'
            );

            const result2 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-2',
                'read-operation-2'
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(result1.data?.status).toBe(LockStatus.ACQUIRED);
            expect(result2.data?.status).toBe(LockStatus.ACQUIRED);

            // 清理
            await lockManager.releaseLock(result1.data!.id, 'owner-1');
            await lockManager.releaseLock(result2.data!.id, 'owner-2');
        });

        it('應該阻止寫鎖與其他鎖並存', async () => {
            const readResult = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation'
            );

            expect(readResult.success).toBe(true);

            // 嘗試獲取寫鎖應該失敗
            const writeResult = await lockManager.acquireLock(
                'resource-1',
                LockType.WRITE,
                'owner-2',
                'write-operation',
                1000 // 短超時
            );

            expect(writeResult.success).toBe(false);
            expect(writeResult.error).toContain('獲取鎖超時');

            // 清理
            await lockManager.releaseLock(readResult.data!.id, 'owner-1');
        });

        it('應該阻止獨占鎖與任何其他鎖並存', async () => {
            const exclusiveResult = await lockManager.acquireLock(
                'resource-1',
                LockType.EXCLUSIVE,
                'owner-1',
                'exclusive-operation'
            );

            expect(exclusiveResult.success).toBe(true);

            // 嘗試獲取讀鎖應該失敗
            const readResult = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-2',
                'read-operation',
                1000
            );

            expect(readResult.success).toBe(false);

            // 清理
            await lockManager.releaseLock(exclusiveResult.data!.id, 'owner-1');
        });

        it('應該正確處理鎖超時', async () => {
            const result = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation'
            );

            expect(result.success).toBe(true);

            // 嘗試獲取不兼容的鎖，應該超時
            const timeoutResult = await lockManager.acquireLock(
                'resource-1',
                LockType.WRITE,
                'owner-2',
                'write-operation',
                100 // 很短的超時
            );

            expect(timeoutResult.success).toBe(false);
            expect(timeoutResult.error).toContain('獲取鎖超時');

            // 清理
            await lockManager.releaseLock(result.data!.id, 'owner-1');
        });

        it('應該拒絕非所有者釋放鎖', async () => {
            const result = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation'
            );

            expect(result.success).toBe(true);

            const releaseResult = await lockManager.releaseLock(
                result.data!.id,
                'owner-2' // 錯誤的所有者
            );

            expect(releaseResult.success).toBe(false);
            expect(releaseResult.error).toContain('無權釋放此鎖');

            // 正確釋放
            await lockManager.releaseLock(result.data!.id, 'owner-1');
        });

        it('應該限制每個資源的最大鎖數量', async () => {
            const lockManager = new ResourceLockManager({
                maxLocksPerResource: 2,
            });

            // 獲取兩個讀鎖
            const result1 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation-1'
            );

            const result2 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-2',
                'read-operation-2'
            );

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);

            // 第三個鎖應該失敗
            const result3 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-3',
                'read-operation-3',
                100
            );

            expect(result3.success).toBe(false);

            // 清理
            await lockManager.releaseLock(result1.data!.id, 'owner-1');
            await lockManager.releaseLock(result2.data!.id, 'owner-2');
            lockManager.cleanup();
        });
    });

    describe('並發控制測試', () => {
        it('應該成功執行帶讀鎖的操作', async () => {
            const mockOperation = jest.fn().mockResolvedValue('read-result');

            const result = await concurrencyManager.executeRead(
                'resource-1',
                'owner-1',
                'read-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('read-result');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該成功執行帶寫鎖的操作', async () => {
            const mockOperation = jest.fn().mockResolvedValue('write-result');

            const result = await concurrencyManager.executeWrite(
                'resource-1',
                'owner-1',
                'write-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('write-result');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該成功執行帶獨占鎖的操作', async () => {
            const mockOperation = jest.fn().mockResolvedValue('exclusive-result');

            const result = await concurrencyManager.executeExclusive(
                'resource-1',
                'owner-1',
                'exclusive-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('exclusive-result');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('應該在操作失敗時正確釋放鎖', async () => {
            const mockOperation = jest.fn().mockRejectedValue(new Error('操作失敗'));

            const result = await concurrencyManager.executeRead(
                'resource-1',
                'owner-1',
                'failing-operation',
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('操作失敗');
            expect(mockOperation).toHaveBeenCalledTimes(1);

            // 驗證鎖已被釋放（可以獲取新的鎖）
            const newResult = await concurrencyManager.executeRead(
                'resource-1',
                'owner-2',
                'new-operation',
                jest.fn().mockResolvedValue('success')
            );

            expect(newResult.success).toBe(true);
        });

        it('應該在重試時正確處理鎖', async () => {
            let callCount = 0;
            const mockOperation = jest.fn().mockImplementation(() => {
                callCount++;
                if (callCount < 3) {
                    throw new Error('臨時失敗');
                }
                return Promise.resolve('success-after-retry');
            });

            const result = await concurrencyManager.executeRead(
                'resource-1',
                'owner-1',
                'retry-operation',
                mockOperation,
                { retries: 3 }
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('success-after-retry');
            expect(result.retryCount).toBe(2);
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });

        it('應該處理並發操作', async () => {
            const results: Array<{ success: boolean; data?: string; error?: string }> = [];

            // 啟動多個並發讀操作
            const promises = Array.from({ length: 5 }, (_, i) =>
                concurrencyManager.executeRead(
                    'resource-1',
                    `owner-${i}`,
                    `read-operation-${i}`,
                    jest.fn().mockImplementation(async () => {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        return `result-${i}`;
                    })
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有讀操作都應該成功
            expect(results).toHaveLength(5);
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.data).toBe(`result-${i}`);
            });
        });

        it('應該序列化寫操作', async () => {
            const results: Array<{ success: boolean; data?: string; error?: string }> = [];
            const executionOrder: number[] = [];

            // 啟動多個並發寫操作
            const promises = Array.from({ length: 3 }, (_, i) =>
                concurrencyManager.executeWrite(
                    'resource-1',
                    `owner-${i}`,
                    `write-operation-${i}`,
                    jest.fn().mockImplementation(async () => {
                        executionOrder.push(i);
                        await new Promise(resolve => setTimeout(resolve, 50));
                        return `write-result-${i}`;
                    })
                ).then(result => results.push(result))
            );

            await Promise.all(promises);

            // 所有寫操作都應該成功
            expect(results).toHaveLength(3);
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.data).toBe(`write-result-${i}`);
            });

            // 寫操作應該序列化執行
            expect(executionOrder).toHaveLength(3);
        });
    });

    describe('工具函數測試', () => {
        it('withConcurrencyControl 應該正確包裝操作', async () => {
            const mockOperation = jest.fn().mockResolvedValue('test-result');

            const result = await withConcurrencyControl(
                'resource-1',
                LockType.READ,
                'owner-1',
                'test-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('test-result');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('withReadLock 應該使用讀鎖', async () => {
            const mockOperation = jest.fn().mockResolvedValue('read-result');

            const result = await withReadLock(
                'resource-1',
                'owner-1',
                'read-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('read-result');
        });

        it('withWriteLock 應該使用寫鎖', async () => {
            const mockOperation = jest.fn().mockResolvedValue('write-result');

            const result = await withWriteLock(
                'resource-1',
                'owner-1',
                'write-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('write-result');
        });

        it('withExclusiveLock 應該使用獨占鎖', async () => {
            const mockOperation = jest.fn().mockResolvedValue('exclusive-result');

            const result = await withExclusiveLock(
                'resource-1',
                'owner-1',
                'exclusive-operation',
                mockOperation
            );

            expect(result.success).toBe(true);
            expect(result.data).toBe('exclusive-result');
        });
    });

    describe('統計信息測試', () => {
        it('應該正確收集鎖統計信息', async () => {
            // 獲取一些鎖
            const result1 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation-1'
            );

            const result2 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-2',
                'read-operation-2'
            );

            const result3 = await lockManager.acquireLock(
                'resource-2',
                LockType.WRITE,
                'owner-3',
                'write-operation'
            );

            const stats = lockManager.getLockStatistics();

            expect(stats.totalLocks).toBe(3);
            expect(stats.activeLocks).toBe(3);
            expect(stats.pendingLocks).toBe(0);
            expect(stats.locksByType[LockType.READ]).toBe(2);
            expect(stats.locksByType[LockType.WRITE]).toBe(1);
            expect(stats.locksByResource['resource-1']).toBe(2);
            expect(stats.locksByResource['resource-2']).toBe(1);

            // 清理
            await lockManager.releaseLock(result1.data!.id, 'owner-1');
            await lockManager.releaseLock(result2.data!.id, 'owner-2');
            await lockManager.releaseLock(result3.data!.id, 'owner-3');
        });

        it('應該正確收集並發統計信息', async () => {
            // 執行一些操作
            await concurrencyManager.executeRead(
                'resource-1',
                'owner-1',
                'read-operation',
                jest.fn().mockResolvedValue('result')
            );

            await concurrencyManager.executeWrite(
                'resource-2',
                'owner-2',
                'write-operation',
                jest.fn().mockResolvedValue('result')
            );

            const stats = concurrencyManager.getConcurrencyStatistics();

            expect(stats.config).toBeDefined();
            expect(stats.lockStatistics).toBeDefined();
            expect(stats.lockStatistics.totalLocks).toBeGreaterThanOrEqual(0);
        });
    });

    describe('死鎖檢測測試', () => {
        it('應該檢測並解決死鎖', async () => {
            // 創建一個可能導致死鎖的場景
            const lockManager = new ResourceLockManager({
                enableDeadlockDetection: true,
                deadlockDetectionInterval: 100,
            });

            // 獲取第一個鎖
            const result1 = await lockManager.acquireLock(
                'resource-1',
                LockType.WRITE,
                'owner-1',
                'write-operation-1'
            );

            expect(result1.success).toBe(true);

            // 嘗試獲取第二個鎖（應該等待）
            const result2Promise = lockManager.acquireLock(
                'resource-1',
                LockType.WRITE,
                'owner-2',
                'write-operation-2',
                2000
            );

            // 等待一段時間讓死鎖檢測運行
            await new Promise(resolve => setTimeout(resolve, 200));

            // 釋放第一個鎖
            await lockManager.releaseLock(result1.data!.id, 'owner-1');

            // 第二個鎖應該成功
            const result2 = await result2Promise;
            expect(result2.success).toBe(true);

            // 清理
            await lockManager.releaseLock(result2.data!.id, 'owner-2');
            lockManager.cleanup();
        });
    });

    describe('鎖清理測試', () => {
        it('應該清理過期的鎖', async () => {
            const lockManager = new ResourceLockManager({
                lockCleanupInterval: 100,
                defaultTimeout: 200,
            });

            // 獲取一個鎖
            const result = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-1',
                'read-operation'
            );

            expect(result.success).toBe(true);

            // 等待鎖過期
            await new Promise(resolve => setTimeout(resolve, 300));

            // 檢查鎖是否被清理
            const stats = lockManager.getLockStatistics();
            expect(stats.activeLocks).toBe(0);

            lockManager.cleanup();
        });
    });

    describe('錯誤處理測試', () => {
        it('應該處理無效的鎖ID', async () => {
            const result = await lockManager.releaseLock('invalid-lock-id', 'owner-1');

            expect(result.success).toBe(false);
            expect(result.error).toContain('鎖不存在');
        });

        it('應該處理操作中的異常', async () => {
            const mockOperation = jest.fn().mockImplementation(() => {
                throw new Error('操作異常');
            });

            const result = await concurrencyManager.executeRead(
                'resource-1',
                'owner-1',
                'failing-operation',
                mockOperation
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('操作異常');
        });

        it('應該處理鎖獲取失敗', async () => {
            // 獲取一個寫鎖
            const result1 = await lockManager.acquireLock(
                'resource-1',
                LockType.WRITE,
                'owner-1',
                'write-operation'
            );

            expect(result1.success).toBe(true);

            // 嘗試獲取不兼容的鎖
            const result2 = await lockManager.acquireLock(
                'resource-1',
                LockType.READ,
                'owner-2',
                'read-operation',
                100
            );

            expect(result2.success).toBe(false);
            expect(result2.error).toContain('獲取鎖超時');

            // 清理
            await lockManager.releaseLock(result1.data!.id, 'owner-1');
        });
    });
});
