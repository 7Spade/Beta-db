/**
 * @fileoverview 共享資源層統一導出
 * 
 * 此檔案提供應用程式中所有可重用、與框架無關的核心資源的統一導出。
 * 包含常數、類型、工具函數、自定義 Hooks、服務、事件系統等。
 */

// 常數 (Constants)
export * from './constants/roles';

// 枚舉 (Enums)
// 目前沒有枚舉檔案，預留位置

// 事件系統 (Events)
export * from './events/app-events';
export * from './events/event-dispatcher';

// 自定義 Hooks
export * from './hooks/use-mobile';
export * from './hooks/use-notifications';
export * from './hooks/use-toast';

// 資料模型 (Models)
export * from './models/ai-token-log.model';

// 驗證結構 (Schemas)
// 目前沒有 schema 檔案，預留位置

// 類型定義 (Types)
export * from './types/env.types';
export * from './types/errors';
export * from './types/types';

// 工具函數 (Utils)
export * from './utils/auth-utils';
export * from './utils/date-utils';
export * from './utils/utils';
