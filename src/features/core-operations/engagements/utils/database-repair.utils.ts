/**
 * @fileoverview 數據庫修復工具
 * 整合所有數據庫交互的修復、優化和監控功能
 */
import type {
    CreateEngagementInput,
    UpdateEngagementInput
} from '../types';
import { databaseValidation, ValidationResult } from './database-validation.utils';
import { errorHandler } from './error-handling.utils';
import { performanceManager, withPerformanceMonitoring } from './performance.utils';

// 修復配置
export interface RepairConfig {
    enableValidation: boolean;
    enableErrorHandling: boolean;
    enablePerformanceMonitoring: boolean;
    enableCaching: boolean;
    enableRetry: boolean;
    maxRetries: number;
    cacheTTL: number;
    enableLogging: boolean;
}

// 修復結果
export interface RepairResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    validation?: ValidationResult;
    performance?: {
        duration: number;
        cacheHit: boolean;
    };
    retryCount?: number;
}

const DEFAULT_REPAIR_CONFIG: RepairConfig = {
    enableValidation: true,
    enableErrorHandling: true,
    enablePerformanceMonitoring: true,
    enableCaching: true,
    enableRetry: true,
    maxRetries: 3,
    cacheTTL: 5 * 60 * 1000, // 5分鐘
    enableLogging: true,
};

export class DatabaseRepairManager {
    private config: RepairConfig;
    private repairLog: Array<{
        timestamp: Date;
        operation: string;
        success: boolean;
        error?: string;
        duration: number;
    }> = [];

    constructor(config: Partial<RepairConfig> = {}) {
        this.config = { ...DEFAULT_REPAIR_CONFIG, ...config };
    }

    /**
     * 修復創建 Engagement 操作
     */
    async repairCreateEngagement(
        input: CreateEngagementInput,
        operation: () => Promise<{ success: boolean; engagementId?: string; error?: string }>
    ): Promise<RepairResult<{ engagementId: string }>> {
        return this.executeWithRepair(
            'createEngagement',
            async () => {
                // 數據驗證
                if (this.config.enableValidation) {
                    const validation = databaseValidation.validateCreateEngagementInput(input);
                    if (!validation.isValid) {
                        throw new Error(`驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 清理輸入數據
                const sanitizedInput = databaseValidation.sanitizeInput(input);

                // 執行操作
                const result = await operation();
                if (!result.success) {
                    throw new Error(result.error || '創建失敗');
                }

                return { engagementId: result.engagementId! };
            },
            { cacheKey: `engagement_${input.name}_${Date.now()}` }
        );
    }

    /**
     * 修復更新 Engagement 操作
     */
    async repairUpdateEngagement(
        id: string,
        input: UpdateEngagementInput,
        operation: () => Promise<{ success: boolean; error?: string }>
    ): Promise<RepairResult> {
        return this.executeWithRepair(
            'updateEngagement',
            async () => {
                // 數據驗證
                if (this.config.enableValidation) {
                    const validation = databaseValidation.validateUpdateEngagementInput(input);
                    if (!validation.isValid) {
                        throw new Error(`驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 清理輸入數據
                const sanitizedInput = databaseValidation.sanitizeInput(input);

                // 執行操作
                const result = await operation();
                if (!result.success) {
                    throw new Error(result.error || '更新失敗');
                }

                return {};
            },
            { cacheKey: `engagement_${id}_update` }
        );
    }

    /**
     * 修復獲取 Engagement 操作
     */
    async repairGetEngagement(
        id: string,
        operation: () => Promise<{ success: boolean; engagement?: any; error?: string }>
    ): Promise<RepairResult<any>> {
        return this.executeWithRepair(
            'getEngagement',
            async () => {
                // ID 驗證
                if (this.config.enableValidation) {
                    const validation = databaseValidation.validateId(id, 'Engagement ID');
                    if (!validation.isValid) {
                        throw new Error(`ID 驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 執行操作
                const result = await operation();
                if (!result.success) {
                    throw new Error(result.error || '獲取失敗');
                }

                return result.engagement;
            },
            { cacheKey: `engagement_${id}` }
        );
    }

    /**
     * 修復刪除 Engagement 操作
     */
    async repairDeleteEngagement(
        id: string,
        operation: () => Promise<{ success: boolean; error?: string }>
    ): Promise<RepairResult> {
        return this.executeWithRepair(
            'deleteEngagement',
            async () => {
                // ID 驗證
                if (this.config.enableValidation) {
                    const validation = databaseValidation.validateId(id, 'Engagement ID');
                    if (!validation.isValid) {
                        throw new Error(`ID 驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 執行操作
                const result = await operation();
                if (!result.success) {
                    throw new Error(result.error || '刪除失敗');
                }

                // 清除相關緩存
                if (this.config.enableCaching) {
                    performanceManager.deleteCache(`engagement_${id}`);
                }

                return {};
            }
        );
    }

    /**
     * 修復批量更新操作
     */
    async repairBatchUpdate(
        updates: Array<{ id: string; data: any }>,
        operation: () => Promise<{ success: boolean; error?: string }>
    ): Promise<RepairResult> {
        return this.executeWithRepair(
            'batchUpdate',
            async () => {
                // 批量驗證
                if (this.config.enableValidation) {
                    const validation = databaseValidation.validateBatchInput(
                        updates,
                        (item) => databaseValidation.validateId(item.id, 'ID'),
                        100
                    );
                    if (!validation.isValid) {
                        throw new Error(`批量驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 執行操作
                const result = await operation();
                if (!result.success) {
                    throw new Error(result.error || '批量更新失敗');
                }

                // 清除相關緩存
                if (this.config.enableCaching) {
                    updates.forEach(update => {
                        performanceManager.deleteCache(`engagement_${update.id}`);
                    });
                }

                return {};
            }
        );
    }

    /**
     * 修復財務操作
     */
    async repairFinancialOperation<T>(
        operation: string,
        input: any,
        operationFn: () => Promise<{ success: boolean;[key: string]: any }>
    ): Promise<RepairResult<T>> {
        return this.executeWithRepair(
            `financial_${operation}`,
            async () => {
                // 財務數據驗證
                if (this.config.enableValidation) {
                    let validation: ValidationResult;

                    switch (operation) {
                        case 'addPayment':
                            validation = databaseValidation.validateCreatePaymentInput(input);
                            break;
                        case 'addReceipt':
                            validation = databaseValidation.validateCreateReceiptInput(input);
                            break;
                        case 'addInvoice':
                            validation = databaseValidation.validateCreateInvoiceInput(input);
                            break;
                        default:
                            validation = { isValid: true, errors: [], warnings: [] };
                    }

                    if (!validation.isValid) {
                        throw new Error(`財務數據驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 執行操作
                const result = await operationFn();
                if (!result.success) {
                    throw new Error(result.error || '財務操作失敗');
                }

                return result as T;
            }
        );
    }

    /**
     * 修復文件操作
     */
    async repairDocumentOperation<T>(
        operation: string,
        input: any,
        operationFn: () => Promise<{ success: boolean;[key: string]: any }>
    ): Promise<RepairResult<T>> {
        return this.executeWithRepair(
            `document_${operation}`,
            async () => {
                // 文件數據驗證
                if (this.config.enableValidation) {
                    let validation: ValidationResult;

                    switch (operation) {
                        case 'addDocument':
                            validation = databaseValidation.validateCreateDocumentInput(input);
                            break;
                        case 'addAttachment':
                            validation = databaseValidation.validateCreateAttachmentInput(input);
                            break;
                        default:
                            validation = { isValid: true, errors: [], warnings: [] };
                    }

                    if (!validation.isValid) {
                        throw new Error(`文件數據驗證失敗: ${validation.errors.join(', ')}`);
                    }
                }

                // 執行操作
                const result = await operationFn();
                if (!result.success) {
                    throw new Error(result.error || '文件操作失敗');
                }

                return result as T;
            }
        );
    }

    /**
     * 執行帶修復的操作
     */
    private async executeWithRepair<T>(
        operation: string,
        operationFn: () => Promise<T>,
        options: {
            cacheKey?: string;
            retryable?: boolean;
        } = {}
    ): Promise<RepairResult<T>> {
        const startTime = performance.now();
        let retryCount = 0;
        let lastError: Error | undefined;

        // 檢查緩存
        if (this.config.enableCaching && options.cacheKey) {
            const cached = performanceManager.getCache<T>(options.cacheKey);
            if (cached) {
                const duration = performance.now() - startTime;
                this.logRepair(operation, true, undefined, duration);
                return {
                    success: true,
                    data: cached,
                    performance: { duration, cacheHit: true },
                };
            }
        }

        // 執行操作（帶重試）
        while (retryCount <= this.config.maxRetries) {
            try {
                let result: T;

                if (this.config.enablePerformanceMonitoring) {
                    result = await withPerformanceMonitoring(operation, operationFn);
                } else {
                    result = await operationFn();
                }

                const duration = performance.now() - startTime;

                // 緩存結果
                if (this.config.enableCaching && options.cacheKey) {
                    performanceManager.setCache(options.cacheKey, result, this.config.cacheTTL);
                }

                this.logRepair(operation, true, undefined, duration);

                return {
                    success: true,
                    data: result,
                    performance: { duration, cacheHit: false },
                    retryCount,
                };
            } catch (error) {
                lastError = error as Error;
                retryCount++;

                // 錯誤處理
                if (this.config.enableErrorHandling) {
                    const errorResult = errorHandler.analyzeError(error, { operation });

                    if (!errorResult.retryable || retryCount > this.config.maxRetries) {
                        const duration = performance.now() - startTime;
                        this.logRepair(operation, false, errorResult.message, duration);

                        return {
                            success: false,
                            error: errorResult.message,
                            retryCount,
                        };
                    }
                }

                // 重試延遲
                if (retryCount <= this.config.maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        const duration = performance.now() - startTime;
        this.logRepair(operation, false, lastError?.message, duration);

        return {
            success: false,
            error: lastError?.message || '操作失敗',
            retryCount,
        };
    }

    /**
     * 記錄修復日誌
     */
    private logRepair(operation: string, success: boolean, error?: string, duration?: number): void {
        if (!this.config.enableLogging) return;

        this.repairLog.push({
            timestamp: new Date(),
            operation,
            success,
            error,
            duration: duration || 0,
        });

        // 保持日誌在合理大小
        if (this.repairLog.length > 1000) {
            this.repairLog = this.repairLog.slice(-500);
        }

        // 記錄錯誤
        if (!success && error) {
            console.error(`數據庫修復失敗 [${operation}]:`, error);
        }
    }

    /**
     * 獲取修復統計
     */
    getRepairStatistics(): {
        totalOperations: number;
        successRate: number;
        averageDuration: number;
        errorRate: number;
        operationsByType: Record<string, number>;
        recentErrors: Array<{
            timestamp: Date;
            operation: string;
            error: string;
        }>;
    } {
        const totalOperations = this.repairLog.length;
        const successfulOperations = this.repairLog.filter(log => log.success).length;
        const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;
        const errorRate = 100 - successRate;

        const totalDuration = this.repairLog.reduce((sum, log) => sum + log.duration, 0);
        const averageDuration = totalOperations > 0 ? totalDuration / totalOperations : 0;

        const operationsByType: Record<string, number> = {};
        this.repairLog.forEach(log => {
            operationsByType[log.operation] = (operationsByType[log.operation] || 0) + 1;
        });

        const recentErrors = this.repairLog
            .filter(log => !log.success && log.error)
            .slice(-10)
            .map(log => ({
                timestamp: log.timestamp,
                operation: log.operation,
                error: log.error!,
            }));

        return {
            totalOperations,
            successRate,
            averageDuration,
            errorRate,
            operationsByType,
            recentErrors,
        };
    }

    /**
     * 清理修復日誌
     */
    clearRepairLog(): void {
        this.repairLog = [];
    }

    /**
     * 生成修復報告
     */
    generateRepairReport(): string {
        const stats = this.getRepairStatistics();
        const cacheStats = performanceManager.getCacheStatistics();
        const perfStats = performanceManager.getPerformanceStatistics();

        return `
數據庫修復報告
==============
修復統計:
- 總操作數: ${stats.totalOperations}
- 成功率: ${stats.successRate.toFixed(2)}%
- 錯誤率: ${stats.errorRate.toFixed(2)}%
- 平均耗時: ${stats.averageDuration.toFixed(2)}ms

緩存統計:
- 命中率: ${cacheStats.hitRate.toFixed(2)}%
- 緩存大小: ${cacheStats.size}
- 命中次數: ${cacheStats.hits}
- 未命中次數: ${cacheStats.misses}

性能統計:
- 總操作數: ${perfStats.totalOperations}
- 平均耗時: ${perfStats.averageDuration.toFixed(2)}ms
- 成功率: ${perfStats.successRate.toFixed(2)}%
- 慢操作數: ${perfStats.slowOperations}

最近錯誤:
${stats.recentErrors.map(error =>
            `- [${error.timestamp.toISOString()}] ${error.operation}: ${error.error}`
        ).join('\n')}
    `;
    }

    /**
     * 健康檢查
     */
    async healthCheck(): Promise<{
        status: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
    }> {
        const issues: string[] = [];
        const recommendations: string[] = [];

        // 檢查成功率
        const stats = this.getRepairStatistics();
        if (stats.successRate < 95) {
            issues.push(`成功率過低: ${stats.successRate.toFixed(2)}%`);
            recommendations.push('檢查錯誤日誌並修復常見問題');
        }

        // 檢查平均耗時
        if (stats.averageDuration > 1000) {
            issues.push(`平均耗時過長: ${stats.averageDuration.toFixed(2)}ms`);
            recommendations.push('優化數據庫查詢和添加索引');
        }

        // 檢查緩存命中率
        const cacheStats = performanceManager.getCacheStatistics();
        if (cacheStats.hitRate < 50) {
            issues.push(`緩存命中率過低: ${cacheStats.hitRate.toFixed(2)}%`);
            recommendations.push('優化緩存策略和增加緩存時間');
        }

        // 檢查內存使用
        const memoryUsage = performanceManager.getMemoryUsage();
        if (memoryUsage.percentage > 80) {
            issues.push(`內存使用率過高: ${memoryUsage.percentage.toFixed(2)}%`);
            recommendations.push('清理緩存和優化內存使用');
        }

        let status: 'healthy' | 'warning' | 'critical';
        if (issues.length === 0) {
            status = 'healthy';
        } else if (issues.length <= 2) {
            status = 'warning';
        } else {
            status = 'critical';
        }

        return {
            status,
            issues,
            recommendations,
        };
    }
}

// 導出單例實例
export const databaseRepairManager = new DatabaseRepairManager();

// 導出工具函數
export const withDatabaseRepair = async <T>(
    operation: string,
    operationFn: () => Promise<T>,
    options: {
        cacheKey?: string;
        retryable?: boolean;
    } = {}
): Promise<RepairResult<T>> => {
    return databaseRepairManager['executeWithRepair'](operation, operationFn, options);
};

export const repairEngagementOperation = async <T>(
    operation: string,
    input: any,
    operationFn: () => Promise<{ success: boolean;[key: string]: any }>
): Promise<RepairResult<T>> => {
    switch (operation) {
        case 'create':
            return databaseRepairManager.repairCreateEngagement(input, operationFn) as Promise<RepairResult<T>>;
        case 'update':
            return databaseRepairManager.repairUpdateEngagement(input.id, input.data, operationFn) as Promise<RepairResult<T>>;
        case 'get':
            return databaseRepairManager.repairGetEngagement(input.id, operationFn) as Promise<RepairResult<T>>;
        case 'delete':
            return databaseRepairManager.repairDeleteEngagement(input.id, operationFn) as Promise<RepairResult<T>>;
        default:
            return databaseRepairManager['executeWithRepair'](operation, operationFn) as Promise<RepairResult<T>>;
    }
};
