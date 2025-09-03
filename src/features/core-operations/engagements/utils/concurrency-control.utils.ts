/**
 * @fileoverview 並發控制和鎖機制工具
 * 提供數據庫操作的並發控制和鎖定機制
 */

// 鎖類型
export enum LockType {
    READ = 'read',
    WRITE = 'write',
    EXCLUSIVE = 'exclusive',
}

// 鎖狀態
export enum LockStatus {
    PENDING = 'pending',
    ACQUIRED = 'acquired',
    RELEASED = 'released',
    TIMEOUT = 'timeout',
    DEADLOCK = 'deadlock',
}

// 鎖信息
export interface LockInfo {
    id: string;
    resourceId: string;
    type: LockType;
    status: LockStatus;
    acquiredAt: Date;
    expiresAt: Date;
    ownerId: string;
    operation: string;
    metadata?: Record<string, any>;
}

// 並發控制配置
export interface ConcurrencyConfig {
    defaultTimeout: number;
    maxRetries: number;
    retryDelay: number;
    deadlockDetectionInterval: number;
    lockCleanupInterval: number;
    maxLocksPerResource: number;
    enableDeadlockDetection: boolean;
    enableLockTimeout: boolean;
}

// 並發控制結果
export interface ConcurrencyResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    lockInfo?: LockInfo;
    waitTime?: number;
    retryCount?: number;
    deadlockDetected?: boolean;
}

// 資源鎖管理器
export class ResourceLockManager {
    private locks: Map<string, LockInfo[]> = new Map();
    private pendingLocks: Map<string, Array<{
        resolve: (lock: LockInfo) => void;
        reject: (error: Error) => void;
        lockInfo: LockInfo;
    }>> = new Map();
    private config: ConcurrencyConfig;
    private cleanupInterval?: NodeJS.Timeout;
    private deadlockDetectionInterval?: NodeJS.Timeout;

    constructor(config: Partial<ConcurrencyConfig> = {}) {
        this.config = {
            defaultTimeout: 30000, // 30秒
            maxRetries: 3,
            retryDelay: 1000, // 1秒
            deadlockDetectionInterval: 5000, // 5秒
            lockCleanupInterval: 10000, // 10秒
            maxLocksPerResource: 10,
            enableDeadlockDetection: true,
            enableLockTimeout: true,
            ...config,
        };

        this.startCleanup();
        if (this.config.enableDeadlockDetection) {
            this.startDeadlockDetection();
        }
    }

    /**
     * 獲取鎖
     */
    async acquireLock(
        resourceId: string,
        type: LockType,
        ownerId: string,
        operation: string,
        timeout: number = this.config.defaultTimeout,
        metadata?: Record<string, any>
    ): Promise<ConcurrencyResult<LockInfo>> {
        const lockId = this.generateLockId();
        const lockInfo: LockInfo = {
            id: lockId,
            resourceId,
            type,
            status: LockStatus.PENDING,
            acquiredAt: new Date(),
            expiresAt: new Date(Date.now() + timeout),
            ownerId,
            operation,
            metadata,
        };

        try {
            // 檢查是否可以立即獲取鎖
            if (this.canAcquireLock(resourceId, type)) {
                lockInfo.status = LockStatus.ACQUIRED;
                this.addLock(resourceId, lockInfo);
                return {
                    success: true,
                    data: lockInfo,
                    lockInfo,
                };
            }

            // 如果不能立即獲取，加入等待隊列
            return await this.waitForLock(lockInfo, timeout);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '獲取鎖失敗',
                lockInfo,
            };
        }
    }

    /**
     * 釋放鎖
     */
    async releaseLock(lockId: string, ownerId: string): Promise<ConcurrencyResult> {
        try {
            const lock = this.findLock(lockId);
            if (!lock) {
                return {
                    success: false,
                    error: '鎖不存在',
                };
            }

            if (lock.ownerId !== ownerId) {
                return {
                    success: false,
                    error: '無權釋放此鎖',
                };
            }

            lock.status = LockStatus.RELEASED;
            this.removeLock(lock.resourceId, lockId);

            // 通知等待中的鎖
            this.notifyPendingLocks(lock.resourceId);

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '釋放鎖失敗',
            };
        }
    }

    /**
     * 檢查是否可以獲取鎖
     */
    private canAcquireLock(resourceId: string, type: LockType): boolean {
        const existingLocks = this.locks.get(resourceId) || [];

        // 檢查資源鎖數量限制
        if (existingLocks.length >= this.config.maxLocksPerResource) {
            return false;
        }

        // 檢查鎖兼容性
        for (const existingLock of existingLocks) {
            if (existingLock.status === LockStatus.ACQUIRED) {
                if (!this.isLockCompatible(type, existingLock.type)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 檢查鎖兼容性
     */
    private isLockCompatible(requestedType: LockType, existingType: LockType): boolean {
        // 讀鎖可以與其他讀鎖兼容
        if (requestedType === LockType.READ && existingType === LockType.READ) {
            return true;
        }

        // 寫鎖和獨占鎖不兼容
        if (requestedType === LockType.WRITE || requestedType === LockType.EXCLUSIVE) {
            return false;
        }

        // 獨占鎖不兼容任何其他鎖
        if (existingType === LockType.EXCLUSIVE) {
            return false;
        }

        return true;
    }

    /**
     * 等待鎖
     */
    private async waitForLock(lockInfo: LockInfo, timeout: number): Promise<ConcurrencyResult<LockInfo>> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                lockInfo.status = LockStatus.TIMEOUT;
                this.removePendingLock(lockInfo.resourceId, lockInfo.id);
                reject(new Error('獲取鎖超時'));
            }, timeout);

            const pendingLock = {
                resolve: (lock: LockInfo) => {
                    clearTimeout(timeoutId);
                    resolve({
                        success: true,
                        data: lock,
                        lockInfo: lock,
                        waitTime: Date.now() - lockInfo.acquiredAt.getTime(),
                    });
                },
                reject: (error: Error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                },
                lockInfo,
            };

            this.addPendingLock(lockInfo.resourceId, pendingLock);
        });
    }

    /**
     * 通知等待中的鎖
     */
    private notifyPendingLocks(resourceId: string): void {
        const pendingLocks = this.pendingLocks.get(resourceId) || [];

        for (let i = pendingLocks.length - 1; i >= 0; i--) {
            const pendingLock = pendingLocks[i];

            if (this.canAcquireLock(resourceId, pendingLock.lockInfo.type)) {
                pendingLock.lockInfo.status = LockStatus.ACQUIRED;
                this.addLock(resourceId, pendingLock.lockInfo);
                this.removePendingLock(resourceId, pendingLock.lockInfo.id);
                pendingLock.resolve(pendingLock.lockInfo);
                break; // 只處理一個等待中的鎖
            }
        }
    }

    /**
     * 添加鎖
     */
    private addLock(resourceId: string, lockInfo: LockInfo): void {
        if (!this.locks.has(resourceId)) {
            this.locks.set(resourceId, []);
        }
        this.locks.get(resourceId)!.push(lockInfo);
    }

    /**
     * 移除鎖
     */
    private removeLock(resourceId: string, lockId: string): void {
        const locks = this.locks.get(resourceId);
        if (locks) {
            const index = locks.findIndex(lock => lock.id === lockId);
            if (index !== -1) {
                locks.splice(index, 1);
                if (locks.length === 0) {
                    this.locks.delete(resourceId);
                }
            }
        }
    }

    /**
     * 添加等待中的鎖
     */
    private addPendingLock(resourceId: string, pendingLock: any): void {
        if (!this.pendingLocks.has(resourceId)) {
            this.pendingLocks.set(resourceId, []);
        }
        this.pendingLocks.get(resourceId)!.push(pendingLock);
    }

    /**
     * 移除等待中的鎖
     */
    private removePendingLock(resourceId: string, lockId: string): void {
        const pendingLocks = this.pendingLocks.get(resourceId);
        if (pendingLocks) {
            const index = pendingLocks.findIndex(lock => lock.lockInfo.id === lockId);
            if (index !== -1) {
                pendingLocks.splice(index, 1);
                if (pendingLocks.length === 0) {
                    this.pendingLocks.delete(resourceId);
                }
            }
        }
    }

    /**
     * 查找鎖
     */
    private findLock(lockId: string): LockInfo | undefined {
        for (const locks of this.locks.values()) {
            const lock = locks.find(l => l.id === lockId);
            if (lock) {
                return lock;
            }
        }
        return undefined;
    }

    /**
     * 生成鎖ID
     */
    private generateLockId(): string {
        return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 開始清理過期鎖
     */
    private startCleanup(): void {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredLocks();
        }, this.config.lockCleanupInterval);
    }

    /**
     * 開始死鎖檢測
     */
    private startDeadlockDetection(): void {
        this.deadlockDetectionInterval = setInterval(() => {
            this.detectDeadlocks();
        }, this.config.deadlockDetectionInterval);
    }

    /**
     * 清理過期鎖
     */
    private cleanupExpiredLocks(): void {
        const now = new Date();

        for (const [resourceId, locks] of this.locks.entries()) {
            for (let i = locks.length - 1; i >= 0; i--) {
                const lock = locks[i];
                if (lock.expiresAt < now) {
                    lock.status = LockStatus.TIMEOUT;
                    this.removeLock(resourceId, lock.id);
                    this.notifyPendingLocks(resourceId);
                }
            }
        }

        // 清理過期的等待鎖
        for (const [resourceId, pendingLocks] of this.pendingLocks.entries()) {
            for (let i = pendingLocks.length - 1; i >= 0; i--) {
                const pendingLock = pendingLocks[i];
                if (pendingLock.lockInfo.expiresAt < now) {
                    pendingLock.lockInfo.status = LockStatus.TIMEOUT;
                    this.removePendingLock(resourceId, pendingLock.lockInfo.id);
                    pendingLock.reject(new Error('等待鎖超時'));
                }
            }
        }
    }

    /**
     * 檢測死鎖
     */
    private detectDeadlocks(): void {
        // 簡化的死鎖檢測：檢查循環等待
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        for (const resourceId of this.locks.keys()) {
            if (!visited.has(resourceId)) {
                if (this.hasCycle(resourceId, visited, recursionStack)) {
                    this.resolveDeadlock(resourceId);
                }
            }
        }
    }

    /**
     * 檢查循環等待
     */
    private hasCycle(resourceId: string, visited: Set<string>, recursionStack: Set<string>): boolean {
        visited.add(resourceId);
        recursionStack.add(resourceId);

        const locks = this.locks.get(resourceId) || [];
        for (const lock of locks) {
            if (lock.status === LockStatus.ACQUIRED) {
                // 檢查是否有其他資源等待此資源
                for (const [otherResourceId, otherLocks] of this.locks.entries()) {
                    if (otherResourceId !== resourceId) {
                        for (const otherLock of otherLocks) {
                            if (otherLock.status === LockStatus.ACQUIRED &&
                                otherLock.metadata?.waitingFor === resourceId) {
                                if (!visited.has(otherResourceId)) {
                                    if (this.hasCycle(otherResourceId, visited, recursionStack)) {
                                        return true;
                                    }
                                } else if (recursionStack.has(otherResourceId)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        recursionStack.delete(resourceId);
        return false;
    }

    /**
     * 解決死鎖
     */
    private resolveDeadlock(resourceId: string): void {
        const locks = this.locks.get(resourceId) || [];

        // 選擇最舊的鎖來釋放
        const oldestLock = locks.reduce((oldest, current) =>
            current.acquiredAt < oldest.acquiredAt ? current : oldest
        );

        if (oldestLock) {
            oldestLock.status = LockStatus.DEADLOCK;
            this.removeLock(resourceId, oldestLock.id);
            this.notifyPendingLocks(resourceId);

            console.warn(`檢測到死鎖，釋放鎖: ${oldestLock.id} (資源: ${resourceId})`);
        }
    }

    /**
     * 獲取鎖統計信息
     */
    getLockStatistics(): {
        totalLocks: number;
        activeLocks: number;
        pendingLocks: number;
        locksByType: Record<LockType, number>;
        locksByResource: Record<string, number>;
        averageWaitTime: number;
    } {
        let totalLocks = 0;
        let activeLocks = 0;
        let pendingLocks = 0;
        const locksByType: Record<LockType, number> = {
            [LockType.READ]: 0,
            [LockType.WRITE]: 0,
            [LockType.EXCLUSIVE]: 0,
        };
        const locksByResource: Record<string, number> = {};
        let totalWaitTime = 0;
        let waitTimeCount = 0;

        for (const [resourceId, locks] of this.locks.entries()) {
            locksByResource[resourceId] = locks.length;

            for (const lock of locks) {
                totalLocks++;
                locksByType[lock.type]++;

                if (lock.status === LockStatus.ACQUIRED) {
                    activeLocks++;
                } else if (lock.status === LockStatus.PENDING) {
                    pendingLocks++;
                }
            }
        }

        for (const pendingLocks of this.pendingLocks.values()) {
            for (const pendingLock of pendingLocks) {
                totalWaitTime += Date.now() - pendingLock.lockInfo.acquiredAt.getTime();
                waitTimeCount++;
            }
        }

        return {
            totalLocks,
            activeLocks,
            pendingLocks,
            locksByType,
            locksByResource,
            averageWaitTime: waitTimeCount > 0 ? totalWaitTime / waitTimeCount : 0,
        };
    }

    /**
     * 清理所有鎖
     */
    cleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        if (this.deadlockDetectionInterval) {
            clearInterval(this.deadlockDetectionInterval);
        }

        this.locks.clear();
        this.pendingLocks.clear();
    }
}

// 並發控制管理器
export class ConcurrencyManager {
    private lockManager: ResourceLockManager;
    private config: ConcurrencyConfig;

    constructor(config: Partial<ConcurrencyConfig> = {}) {
        this.config = {
            defaultTimeout: 30000,
            maxRetries: 3,
            retryDelay: 1000,
            deadlockDetectionInterval: 5000,
            lockCleanupInterval: 10000,
            maxLocksPerResource: 10,
            enableDeadlockDetection: true,
            enableLockTimeout: true,
            ...config,
        };

        this.lockManager = new ResourceLockManager(this.config);
    }

    /**
     * 執行帶鎖的操作
     */
    async executeWithLock<T>(
        resourceId: string,
        type: LockType,
        ownerId: string,
        operation: string,
        operationFn: () => Promise<T>,
        options: {
            timeout?: number;
            retries?: number;
            metadata?: Record<string, any>;
        } = {}
    ): Promise<ConcurrencyResult<T>> {
        const timeout = options.timeout || this.config.defaultTimeout;
        const maxRetries = options.retries || this.config.maxRetries;
        let retryCount = 0;
        let lockInfo: LockInfo | undefined;

        while (retryCount <= maxRetries) {
            try {
                // 獲取鎖
                const lockResult = await this.lockManager.acquireLock(
                    resourceId,
                    type,
                    ownerId,
                    operation,
                    timeout,
                    options.metadata
                );

                if (!lockResult.success || !lockResult.data) {
                    throw new Error(lockResult.error || '獲取鎖失敗');
                }

                lockInfo = lockResult.data;

                // 執行操作
                const result = await operationFn();

                // 釋放鎖
                await this.lockManager.releaseLock(lockInfo.id, ownerId);

                return {
                    success: true,
                    data: result,
                    lockInfo,
                    retryCount,
                };
            } catch (error) {
                retryCount++;

                // 如果獲取了鎖但操作失敗，確保釋放鎖
                if (lockInfo) {
                    try {
                        await this.lockManager.releaseLock(lockInfo.id, ownerId);
                    } catch (releaseError) {
                        console.error('釋放鎖失敗:', releaseError);
                    }
                    lockInfo = undefined;
                }

                if (retryCount > maxRetries) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : '操作失敗',
                        retryCount,
                    };
                }

                // 重試延遲
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
            }
        }

        return {
            success: false,
            error: '達到最大重試次數',
            retryCount,
        };
    }

    /**
     * 執行讀操作
     */
    async executeRead<T>(
        resourceId: string,
        ownerId: string,
        operation: string,
        operationFn: () => Promise<T>,
        options: {
            timeout?: number;
            retries?: number;
        } = {}
    ): Promise<ConcurrencyResult<T>> {
        return this.executeWithLock(
            resourceId,
            LockType.READ,
            ownerId,
            operation,
            operationFn,
            options
        );
    }

    /**
     * 執行寫操作
     */
    async executeWrite<T>(
        resourceId: string,
        ownerId: string,
        operation: string,
        operationFn: () => Promise<T>,
        options: {
            timeout?: number;
            retries?: number;
        } = {}
    ): Promise<ConcurrencyResult<T>> {
        return this.executeWithLock(
            resourceId,
            LockType.WRITE,
            ownerId,
            operation,
            operationFn,
            options
        );
    }

    /**
     * 執行獨占操作
     */
    async executeExclusive<T>(
        resourceId: string,
        ownerId: string,
        operation: string,
        operationFn: () => Promise<T>,
        options: {
            timeout?: number;
            retries?: number;
        } = {}
    ): Promise<ConcurrencyResult<T>> {
        return this.executeWithLock(
            resourceId,
            LockType.EXCLUSIVE,
            ownerId,
            operation,
            operationFn,
            options
        );
    }

    /**
     * 獲取並發統計信息
     */
    getConcurrencyStatistics(): {
        lockStatistics: ReturnType<ResourceLockManager['getLockStatistics']>;
        config: ConcurrencyConfig;
    } {
        return {
            lockStatistics: this.lockManager.getLockStatistics(),
            config: this.config,
        };
    }

    /**
     * 清理資源
     */
    cleanup(): void {
        this.lockManager.cleanup();
    }
}

// 導出單例實例
export const concurrencyManager = new ConcurrencyManager();

// 導出工具函數
export const withConcurrencyControl = async <T>(
    resourceId: string,
    type: LockType,
    ownerId: string,
    operation: string,
    operationFn: () => Promise<T>,
    options: {
        timeout?: number;
        retries?: number;
        metadata?: Record<string, any>;
    } = {}
): Promise<ConcurrencyResult<T>> => {
    return concurrencyManager.executeWithLock(
        resourceId,
        type,
        ownerId,
        operation,
        operationFn,
        options
    );
};

export const withReadLock = async <T>(
    resourceId: string,
    ownerId: string,
    operation: string,
    operationFn: () => Promise<T>,
    options: {
        timeout?: number;
        retries?: number;
    } = {}
): Promise<ConcurrencyResult<T>> => {
    return concurrencyManager.executeRead(
        resourceId,
        ownerId,
        operation,
        operationFn,
        options
    );
};

export const withWriteLock = async <T>(
    resourceId: string,
    ownerId: string,
    operation: string,
    operationFn: () => Promise<T>,
    options: {
        timeout?: number;
        retries?: number;
    } = {}
): Promise<ConcurrencyResult<T>> => {
    return concurrencyManager.executeWrite(
        resourceId,
        ownerId,
        operation,
        operationFn,
        options
    );
};

export const withExclusiveLock = async <T>(
    resourceId: string,
    ownerId: string,
    operation: string,
    operationFn: () => Promise<T>,
    options: {
        timeout?: number;
        retries?: number;
    } = {}
): Promise<ConcurrencyResult<T>> => {
    return concurrencyManager.executeExclusive(
        resourceId,
        ownerId,
        operation,
        operationFn,
        options
    );
};
