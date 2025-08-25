/**
 * @fileoverview 身份驗證相關的 TypeScript 類型定義
 * @description 集中管理所有與 Auth 功能相關的類型，確保整個模組的類型安全。
 */

import type { User } from 'firebase/auth';

// 用於 Server Action 的返回類型
export interface AuthActionResponse {
  success: boolean;
  user?: User;
  error?: string;
}
