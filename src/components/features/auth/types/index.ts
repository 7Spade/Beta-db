/**
 * @fileoverview 身份驗證相關的 TypeScript 類型定義
 * @description 集中管理所有與 Auth 功能相關的類型，確保整個模組的類型安全。
 */

// 例如，定義 User 類型
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// 用於 Server Action 的返回類型
export interface AuthActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}
