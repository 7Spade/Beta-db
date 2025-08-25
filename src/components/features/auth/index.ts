/**
 * Auth Module - 認證模組主入口
 * 
 * 功能說明：
 * - 統一導出所有認證相關的組件、hooks、服務和工具
 * - 提供模組化的認證功能整合
 * - 支援多種登入方式：Email/Password、Google、Facebook、Apple、GitHub等
 * - 包含完整的認證流程：登入、註冊、密碼重置、郵箱驗證
 * - 整合 Firebase Auth 和自定義認證邏輯
 * 
 * 主要導出：
 * - 認證組件 (components)
 * - 認證 Hooks (hooks)
 * - 認證服務 (services)
 * - 認證工具 (utils)
 * - 認證類型 (types)
 */

// 導出所有認證相關功能
export * from './components';
export * from './hooks';
export * from './services';
export * from './utils';
export * from './types';
export * from './providers';
