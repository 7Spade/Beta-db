/**
 * @fileoverview 性能優化和緩存工具
 * 提供緩存管理、性能監控和優化策略
 */

// 緩存配置
export interface CacheConfig {
    maxSize: number;
    ttl: number; // 生存時間（毫秒）
    enableCompression: boolean;
    enablePersistence: boolean;
}

// 緩存項目
interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}

// 性能指標
export interface PerformanceMetrics {
    operation: string;
    startTime: number;
    endTime: number;
    duration: number;
    success: boolean;
    error?: string;
    cacheHit?: boolean;
    dataSize?: number;
}

// 緩存統計
export interface CacheStatistics {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    hitRate: number;
    averageAccessTime: number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxSize: 1000,
    ttl: 5 * 60 * 1000, // 5分鐘
    enableCompression: false,
    enablePersistence: false,
};

export class PerformanceManager {
    private cache: Map<string, CacheItem<any>> = new Map();
    private config: CacheConfig;
    private metrics: PerformanceMetrics[] = [];
    private cacheStats = {
        hits: 0,
        misses: 0,
        evictions: 0,
    };

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
        this.startCleanupInterval();
    }

    /**
     * 開始性能監控
     */
    startMonitoring(operation: string): { end: (success: boolean, error?: string, dataSize?: number) => void } {
        const startTime = performance.now();
        let cacheHit = false;

        return {
            end: (success: boolean, error?: string, dataSize?: number) => {
                const endTime = performance.now();
                const duration = endTime - startTime;

                const metric: PerformanceMetrics = {
                    operation,
                    startTime,
                    endTime,
                    duration,
                    success,
                    error,
                    cacheHit,
                    dataSize,
                };

                this.recordMetric(metric);
            },
        };
    }

    /**
     * 記錄性能指標
     */
    private recordMetric(metric: PerformanceMetrics): void {
        this.metrics.push(metric);

        // 保持指標在合理大小
        if (this.metrics.length > 10000) {
            this.metrics = this.metrics.slice(-5000);
        }

        // 記錄慢操作
        if (metric.duration > 1000) { // 超過1秒
            console.warn(`慢操作檢測: ${metric.operation} 耗時 ${metric.duration.toFixed(2)}ms`);
        }
    }

    /**
     * 緩存數據
     */
    setCache<T>(key: string, data: T, ttl?: number): void {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.config.ttl,
            accessCount: 0,
            lastAccessed: Date.now(),
        };

        // 檢查緩存大小限制
        if (this.cache.size >= this.config.maxSize) {
            this.evictLeastRecentlyUsed();
        }

        this.cache.set(key, item);
    }

    /**
     * 獲取緩存數據
     */
    getCache<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) {
            this.cacheStats.misses++;
            return null;
        }

        // 檢查是否過期
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            this.cacheStats.misses++;
            return null;
        }

        // 更新訪問統計
        item.accessCount++;
        item.lastAccessed = Date.now();
        this.cacheStats.hits++;

        return item.data;
    }

    /**
     * 刪除緩存
     */
    deleteCache(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * 清空緩存
     */
    clearCache(): void {
        this.cache.clear();
        this.cacheStats = {
            hits: 0,
            misses: 0,
            evictions: 0,
        };
    }

    /**
     * 驅逐最近最少使用的項目
     */
    private evictLeastRecentlyUsed(): void {
        let oldestKey = '';
        let oldestTime = Date.now();

        for (const [key, item] of this.cache.entries()) {
            if (item.lastAccessed < oldestTime) {
                oldestTime = item.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.cacheStats.evictions++;
        }
    }

    /**
     * 啟動清理間隔
     */
    private startCleanupInterval(): void {
        setInterval(() => {
            this.cleanupExpiredItems();
        }, 60000); // 每分鐘清理一次
    }

    /**
     * 清理過期項目
     */
    private cleanupExpiredItems(): void {
        const now = Date.now();
        const expiredKeys: string[] = [];

        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                expiredKeys.push(key);
            }
        }

        expiredKeys.forEach(key => {
            this.cache.delete(key);
        });
    }

    /**
     * 獲取緩存統計
     */
    getCacheStatistics(): CacheStatistics {
        const totalRequests = this.cacheStats.hits + this.cacheStats.misses;
        const hitRate = totalRequests > 0 ? (this.cacheStats.hits / totalRequests) * 100 : 0;

        // 計算平均訪問時間
        let totalAccessTime = 0;
        let accessCount = 0;

        for (const item of this.cache.values()) {
            totalAccessTime += item.accessCount;
            accessCount++;
        }

        const averageAccessTime = accessCount > 0 ? totalAccessTime / accessCount : 0;

        return {
            hits: this.cacheStats.hits,
            misses: this.cacheStats.misses,
            evictions: this.cacheStats.evictions,
            size: this.cache.size,
            hitRate,
            averageAccessTime,
        };
    }

    /**
     * 獲取性能指標
     */
    getPerformanceMetrics(operation?: string): PerformanceMetrics[] {
        if (operation) {
            return this.metrics.filter(m => m.operation === operation);
        }
        return [...this.metrics];
    }

    /**
     * 獲取性能統計
     */
    getPerformanceStatistics(operation?: string): {
        totalOperations: number;
        averageDuration: number;
        successRate: number;
        slowOperations: number;
        errorRate: number;
    } {
        const metrics = operation ? this.metrics.filter(m => m.operation === operation) : this.metrics;

        if (metrics.length === 0) {
            return {
                totalOperations: 0,
                averageDuration: 0,
                successRate: 0,
                slowOperations: 0,
                errorRate: 0,
            };
        }

        const totalOperations = metrics.length;
        const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
        const averageDuration = totalDuration / totalOperations;
        const successfulOperations = metrics.filter(m => m.success).length;
        const successRate = (successfulOperations / totalOperations) * 100;
        const slowOperations = metrics.filter(m => m.duration > 1000).length;
        const errorRate = ((totalOperations - successfulOperations) / totalOperations) * 100;

        return {
            totalOperations,
            averageDuration,
            successRate,
            slowOperations,
            errorRate,
        };
    }

    /**
     * 優化數據庫查詢
     */
    optimizeQuery(query: any, options: {
        limit?: number;
        orderBy?: string;
        where?: any[];
        cacheKey?: string;
    }): any {
        // 添加查詢優化邏輯
        if (options.limit && options.limit > 100) {
            console.warn('查詢限制過大，可能影響性能');
        }

        // 檢查是否有緩存
        if (options.cacheKey) {
            const cached = this.getCache(options.cacheKey);
            if (cached) {
                return cached;
            }
        }

        return query;
    }

    /**
     * 批量操作優化
     */
    optimizeBatchOperation<T>(
        items: T[],
        batchSize = 100,
        operation: (batch: T[]) => Promise<any>
    ): Promise<any[]> {
        const results: any[] = [];
        const batches: T[][] = [];

        // 將項目分批
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }

        // 並行處理批次
        const promises = batches.map(batch => operation(batch));
        return Promise.all(promises);
    }

    /**
     * 數據壓縮
     */
    compressData(data: any): string {
        try {
            return JSON.stringify(data);
        } catch (error) {
            console.error('數據壓縮失敗:', error);
            return JSON.stringify({ error: '壓縮失敗' });
        }
    }

    /**
     * 數據解壓縮
     */
    decompressData<T>(compressedData: string): T | null {
        try {
            return JSON.parse(compressedData);
        } catch (error) {
            console.error('數據解壓縮失敗:', error);
            return null;
        }
    }

    /**
     * 內存使用監控
     */
    getMemoryUsage(): {
        used: number;
        total: number;
        percentage: number;
    } {
        if (typeof performance !== 'undefined' && (performance as any).memory) {
            const memory = (performance as any).memory;
            return {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
            };
        }

        return {
            used: 0,
            total: 0,
            percentage: 0,
        };
    }

    /**
     * 清理性能數據
     */
    clearPerformanceData(): void {
        this.metrics = [];
        this.cacheStats = {
            hits: 0,
            misses: 0,
            evictions: 0,
        };
    }

    /**
     * 生成性能報告
     */
    generatePerformanceReport(): string {
        const cacheStats = this.getCacheStatistics();
        const perfStats = this.getPerformanceStatistics();
        const memoryUsage = this.getMemoryUsage();

        return `
性能報告
========
緩存統計:
- 命中率: ${cacheStats.hitRate.toFixed(2)}%
- 緩存大小: ${cacheStats.size}
- 命中次數: ${cacheStats.hits}
- 未命中次數: ${cacheStats.misses}
- 驅逐次數: ${cacheStats.evictions}

性能統計:
- 總操作數: ${perfStats.totalOperations}
- 平均耗時: ${perfStats.averageDuration.toFixed(2)}ms
- 成功率: ${perfStats.successRate.toFixed(2)}%
- 慢操作數: ${perfStats.slowOperations}
- 錯誤率: ${perfStats.errorRate.toFixed(2)}%

內存使用:
- 已使用: ${(memoryUsage.used / 1024 / 1024).toFixed(2)}MB
- 總計: ${(memoryUsage.total / 1024 / 1024).toFixed(2)}MB
- 使用率: ${memoryUsage.percentage.toFixed(2)}%
    `;
    }
}

// 導出單例實例
export const performanceManager = new PerformanceManager();

// 導出工具函數
export const withPerformanceMonitoring = async <T>(
    operation: string,
    fn: () => Promise<T>
): Promise<T> => {
    const monitor = performanceManager.startMonitoring(operation);

    try {
        const result = await fn();
        monitor.end(true);
        return result;
    } catch (error) {
        monitor.end(false, error instanceof Error ? error.message : '未知錯誤');
        throw error;
    }
};

export const withCache = <T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
): Promise<T> => {
    const cached = performanceManager.getCache<T>(key);
    if (cached) {
        return Promise.resolve(cached);
    }

    return fn().then(result => {
        performanceManager.setCache(key, result, ttl);
        return result;
    });
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): T => {
    let timeout: NodeJS.Timeout;

    return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): T => {
    let inThrottle: boolean;

    return ((...args: any[]) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }) as T;
};
