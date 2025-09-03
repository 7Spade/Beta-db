/**
 * @fileoverview 錯誤處理和恢復工具
 * 提供統一的錯誤處理、重試機制和恢復策略
 */

// 錯誤類型枚舉
export enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    CONCURRENT_MODIFICATION_ERROR = 'CONCURRENT_MODIFICATION_ERROR',
    RESOURCE_NOT_FOUND_ERROR = 'RESOURCE_NOT_FOUND_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// 錯誤嚴重性級別
export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

// 錯誤信息接口
export interface ErrorInfo {
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    code?: string;
    details?: any;
    timestamp: Date;
    userId?: string;
    operation?: string;
    resourceId?: string;
    retryable: boolean;
    retryCount?: number;
    maxRetries?: number;
}

// 重試配置
export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableErrors: ErrorType[];
}

// 恢復策略
export interface RecoveryStrategy {
    type: 'retry' | 'fallback' | 'circuit_breaker' | 'rollback';
    config?: any;
}

// 錯誤處理結果
export interface ErrorHandlingResult {
    success: boolean;
    error?: ErrorInfo;
    recovered?: boolean;
    fallbackData?: any;
    shouldRetry?: boolean;
    retryAfter?: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableErrors: [
        ErrorType.NETWORK_ERROR,
        ErrorType.DATABASE_ERROR,
        ErrorType.RATE_LIMIT_ERROR,
        ErrorType.TIMEOUT_ERROR,
    ],
};

export class ErrorHandler {
    private retryConfig: RetryConfig;
    private errorLog: ErrorInfo[] = [];
    private circuitBreakerState: Map<string, { failures: number; lastFailure: Date; isOpen: boolean }> = new Map();

    constructor(retryConfig: Partial<RetryConfig> = {}) {
        this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    }

    /**
     * 分析錯誤並創建錯誤信息
     */
    analyzeError(error: any, context?: {
        operation?: string;
        userId?: string;
        resourceId?: string;
    }): ErrorInfo {
        const errorType = this.determineErrorType(error);
        const severity = this.determineErrorSeverity(errorType, error);
        const retryable = this.isRetryable(errorType);

        const errorInfo: ErrorInfo = {
            type: errorType,
            severity,
            message: this.extractErrorMessage(error),
            code: this.extractErrorCode(error),
            details: this.extractErrorDetails(error),
            timestamp: new Date(),
            userId: context?.userId,
            operation: context?.operation,
            resourceId: context?.resourceId,
            retryable,
            retryCount: 0,
            maxRetries: retryable ? this.retryConfig.maxRetries : 0,
        };

        this.logError(errorInfo);
        return errorInfo;
    }

    /**
     * 確定錯誤類型
     */
    private determineErrorType(error: any): ErrorType {
        if (!error) return ErrorType.UNKNOWN_ERROR;

        const message = error.message?.toLowerCase() || '';
        const code = error.code?.toLowerCase() || '';

        // 網絡錯誤
        if (message.includes('network') || message.includes('connection') ||
            code.includes('network') || code.includes('connection')) {
            return ErrorType.NETWORK_ERROR;
        }

        // 數據庫錯誤
        if (message.includes('firestore') || message.includes('database') ||
            code.includes('firestore') || code.includes('database') ||
            code.includes('permission') || code.includes('not-found') ||
            code.includes('already-exists') || code.includes('failed-precondition')) {
            return ErrorType.DATABASE_ERROR;
        }

        // 認證錯誤
        if (message.includes('auth') || message.includes('unauthorized') ||
            code.includes('auth') || code.includes('unauthorized') ||
            code.includes('permission-denied')) {
            return ErrorType.AUTHENTICATION_ERROR;
        }

        // 授權錯誤
        if (message.includes('forbidden') || message.includes('access denied') ||
            code.includes('forbidden') || code.includes('access-denied')) {
            return ErrorType.AUTHORIZATION_ERROR;
        }

        // 速率限制錯誤
        if (message.includes('rate limit') || message.includes('too many requests') ||
            code.includes('rate-limit') || code.includes('too-many-requests')) {
            return ErrorType.RATE_LIMIT_ERROR;
        }

        // 超時錯誤
        if (message.includes('timeout') || message.includes('timed out') ||
            code.includes('timeout') || code.includes('deadline-exceeded')) {
            return ErrorType.TIMEOUT_ERROR;
        }

        // 並發修改錯誤
        if (message.includes('concurrent') || message.includes('conflict') ||
            code.includes('concurrent') || code.includes('conflict') ||
            code.includes('aborted')) {
            return ErrorType.CONCURRENT_MODIFICATION_ERROR;
        }

        // 資源未找到錯誤
        if (message.includes('not found') || message.includes('does not exist') ||
            code.includes('not-found') || code.includes('does-not-exist')) {
            return ErrorType.RESOURCE_NOT_FOUND_ERROR;
        }

        // 驗證錯誤
        if (message.includes('validation') || message.includes('invalid') ||
            code.includes('validation') || code.includes('invalid-argument')) {
            return ErrorType.VALIDATION_ERROR;
        }

        return ErrorType.UNKNOWN_ERROR;
    }

    /**
     * 確定錯誤嚴重性
     */
    private determineErrorSeverity(errorType: ErrorType, error: any): ErrorSeverity {
        switch (errorType) {
            case ErrorType.AUTHENTICATION_ERROR:
            case ErrorType.AUTHORIZATION_ERROR:
                return ErrorSeverity.HIGH;
            case ErrorType.DATABASE_ERROR:
            case ErrorType.CONCURRENT_MODIFICATION_ERROR:
                return ErrorSeverity.MEDIUM;
            case ErrorType.NETWORK_ERROR:
            case ErrorType.TIMEOUT_ERROR:
            case ErrorType.RATE_LIMIT_ERROR:
                return ErrorSeverity.LOW;
            case ErrorType.VALIDATION_ERROR:
            case ErrorType.RESOURCE_NOT_FOUND_ERROR:
                return ErrorSeverity.MEDIUM;
            default:
                return ErrorSeverity.MEDIUM;
        }
    }

    /**
     * 檢查是否可重試
     */
    private isRetryable(errorType: ErrorType): boolean {
        return this.retryConfig.retryableErrors.includes(errorType);
    }

    /**
     * 提取錯誤消息
     */
    private extractErrorMessage(error: any): string {
        if (typeof error === 'string') return error;
        if (error?.message) return error.message;
        if (error?.error?.message) return error.error.message;
        return '發生未知錯誤';
    }

    /**
     * 提取錯誤代碼
     */
    private extractErrorCode(error: any): string | undefined {
        return error?.code || error?.error?.code;
    }

    /**
     * 提取錯誤詳情
     */
    private extractErrorDetails(error: any): any {
        return {
            stack: error?.stack,
            name: error?.name,
            cause: error?.cause,
            ...error,
        };
    }

    /**
     * 記錄錯誤
     */
    private logError(errorInfo: ErrorInfo): void {
        this.errorLog.push(errorInfo);

        // 保持錯誤日誌在合理大小
        if (this.errorLog.length > 1000) {
            this.errorLog = this.errorLog.slice(-500);
        }

        // 根據嚴重性決定是否立即報告
        if (errorInfo.severity === ErrorSeverity.CRITICAL || errorInfo.severity === ErrorSeverity.HIGH) {
            console.error('嚴重錯誤:', errorInfo);
        } else {
            console.warn('錯誤:', errorInfo);
        }
    }

    /**
     * 執行帶重試的操作
     */
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        context?: {
            operation?: string;
            userId?: string;
            resourceId?: string;
        }
    ): Promise<ErrorHandlingResult & { data?: T }> {
        let lastError: ErrorInfo | undefined;
        let retryCount = 0;

        while (retryCount <= this.retryConfig.maxRetries) {
            try {
                const result = await operation();
                return {
                    success: true,
                    data: result,
                    recovered: retryCount > 0,
                };
            } catch (error) {
                lastError = this.analyzeError(error, context);
                lastError.retryCount = retryCount;

                if (!lastError.retryable || retryCount >= this.retryConfig.maxRetries) {
                    return {
                        success: false,
                        error: lastError,
                        shouldRetry: false,
                    };
                }

                // 檢查斷路器狀態
                const circuitBreakerKey = `${context?.operation || 'unknown'}_${context?.resourceId || 'unknown'}`;
                if (this.isCircuitBreakerOpen(circuitBreakerKey)) {
                    return {
                        success: false,
                        error: lastError,
                        shouldRetry: false,
                    };
                }

                // 計算重試延遲
                const delay = this.calculateRetryDelay(retryCount);
                await this.sleep(delay);

                retryCount++;
            }
        }

        return {
            success: false,
            error: lastError,
            shouldRetry: false,
        };
    }

    /**
     * 計算重試延遲
     */
    private calculateRetryDelay(retryCount: number): number {
        const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
        return Math.min(delay, this.retryConfig.maxDelay);
    }

    /**
     * 睡眠函數
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 檢查斷路器是否開啟
     */
    private isCircuitBreakerOpen(key: string): boolean {
        const state = this.circuitBreakerState.get(key);
        if (!state) return false;

        const now = new Date();
        const timeSinceLastFailure = now.getTime() - state.lastFailure.getTime();
        const resetTimeout = 60000; // 1分鐘

        if (state.isOpen && timeSinceLastFailure > resetTimeout) {
            // 重置斷路器
            state.isOpen = false;
            state.failures = 0;
            return false;
        }

        return state.isOpen;
    }

    /**
     * 更新斷路器狀態
     */
    private updateCircuitBreaker(key: string, success: boolean): void {
        const state = this.circuitBreakerState.get(key) || {
            failures: 0,
            lastFailure: new Date(),
            isOpen: false,
        };

        if (success) {
            state.failures = 0;
            state.isOpen = false;
        } else {
            state.failures++;
            state.lastFailure = new Date();

            // 如果失敗次數超過閾值，開啟斷路器
            if (state.failures >= 5) {
                state.isOpen = true;
            }
        }

        this.circuitBreakerState.set(key, state);
    }

    /**
     * 處理數據庫操作錯誤
     */
    async handleDatabaseOperation<T>(
        operation: () => Promise<T>,
        context?: {
            operation?: string;
            userId?: string;
            resourceId?: string;
        }
    ): Promise<ErrorHandlingResult & { data?: T }> {
        const circuitBreakerKey = `${context?.operation || 'unknown'}_${context?.resourceId || 'unknown'}`;

        try {
            const result = await this.executeWithRetry(operation, context);

            if (result.success) {
                this.updateCircuitBreaker(circuitBreakerKey, true);
                return result;
            } else {
                this.updateCircuitBreaker(circuitBreakerKey, false);
                return result;
            }
        } catch (error) {
            this.updateCircuitBreaker(circuitBreakerKey, false);
            const errorInfo = this.analyzeError(error, context);
            return {
                success: false,
                error: errorInfo,
                shouldRetry: false,
            };
        }
    }

    /**
     * 獲取錯誤統計
     */
    getErrorStatistics(): {
        totalErrors: number;
        errorsByType: Record<ErrorType, number>;
        errorsBySeverity: Record<ErrorSeverity, number>;
        recentErrors: ErrorInfo[];
    } {
        const errorsByType: Record<ErrorType, number> = {} as any;
        const errorsBySeverity: Record<ErrorSeverity, number> = {} as any;

        // 初始化計數器
        Object.values(ErrorType).forEach(type => {
            errorsByType[type] = 0;
        });
        Object.values(ErrorSeverity).forEach(severity => {
            errorsBySeverity[severity] = 0;
        });

        // 統計錯誤
        this.errorLog.forEach(error => {
            errorsByType[error.type]++;
            errorsBySeverity[error.severity]++;
        });

        // 獲取最近的錯誤
        const recentErrors = this.errorLog
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);

        return {
            totalErrors: this.errorLog.length,
            errorsByType,
            errorsBySeverity,
            recentErrors,
        };
    }

    /**
     * 清理錯誤日誌
     */
    clearErrorLog(): void {
        this.errorLog = [];
    }

    /**
     * 重置斷路器
     */
    resetCircuitBreaker(key?: string): void {
        if (key) {
            this.circuitBreakerState.delete(key);
        } else {
            this.circuitBreakerState.clear();
        }
    }

    /**
     * 創建用戶友好的錯誤消息
     */
    createUserFriendlyMessage(errorInfo: ErrorInfo): string {
        switch (errorInfo.type) {
            case ErrorType.NETWORK_ERROR:
                return '網絡連接異常，請檢查您的網絡連接後重試';
            case ErrorType.DATABASE_ERROR:
                return '數據庫操作失敗，請稍後重試';
            case ErrorType.AUTHENTICATION_ERROR:
                return '身份驗證失敗，請重新登錄';
            case ErrorType.AUTHORIZATION_ERROR:
                return '您沒有權限執行此操作';
            case ErrorType.RATE_LIMIT_ERROR:
                return '操作過於頻繁，請稍後重試';
            case ErrorType.TIMEOUT_ERROR:
                return '操作超時，請重試';
            case ErrorType.CONCURRENT_MODIFICATION_ERROR:
                return '數據已被其他用戶修改，請刷新後重試';
            case ErrorType.RESOURCE_NOT_FOUND_ERROR:
                return '請求的資源不存在';
            case ErrorType.VALIDATION_ERROR:
                return '輸入數據無效，請檢查後重試';
            default:
                return '發生未知錯誤，請聯繫技術支持';
        }
    }
}

// 導出單例實例
export const errorHandler = new ErrorHandler();

// 導出工具函數
export const createErrorResult = (error: any, context?: any): ErrorHandlingResult => {
    const errorInfo = errorHandler.analyzeError(error, context);
    return {
        success: false,
        error: errorInfo,
        shouldRetry: errorInfo.retryable,
    };
};

export const createSuccessResult = <T>(data: T, recovered = false): ErrorHandlingResult & { data: T } => {
    return {
        success: true,
        data,
        recovered,
    };
};
