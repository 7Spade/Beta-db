/**
 * @project Beta-db Integrated Platform - 統一整合平台認證模組
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 * 
 * @fileoverview Auth Module - 認證模組主入口
 * @description
 * 
 * ### 功能特性
 * - 🔐 多種登入方式支援
 * - 📱 響應式設計
 * - 🚀 基於 React 19 + NextJS 15
 * - 🎨 使用 Shadcn/ui 組件
 * - 🔒 完整的認證流程
 * - 📊 認證狀態管理
 * 
 * ### 目錄結構
 * `
 * auth/
 * ├── actions/          # Server Actions, 處理後端邏輯
 * ├── components/       # 可重用的 UI 組件 (如表單)
 * ├── forms/            # Zod 表單驗證 schemas
 * ├── hooks/            # React Hooks (如 useAuthState)
 * ├── providers/        # Context Providers (如 AuthProvider)
 * ├── types/            # TypeScript 類型定義
 * └── views/            # 頁面級別的視圖元件
 * `
 */

// 導出所有認證相關功能
export * from './actions';
export * from './components';
export * from './forms';
export * from './hooks';
export * from './providers';
export * from './types';
export * from './views';
