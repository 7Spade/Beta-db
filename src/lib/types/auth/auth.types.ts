/**
 * Auth Types - 認證相關類型定義 (lib 層)
 * 
 * 功能說明：
 * - 定義認證系統中使用的所有 TypeScript 類型
 * - 包含認證狀態、方法、錯誤等類型
 * - 提供類型安全的認證介面
 * 
 * 主要類型：
 * - AuthState: 認證狀態枚舉
 * - AuthMethod: 認證方法類型
 * - AuthError: 認證錯誤類型
 * - AuthProvider: 認證提供者類型
 * - LoginCredentials: 登入憑證類型
 * - RegisterData: 註冊資料類型
 * - PasswordResetData: 密碼重置資料類型
 * - EmailVerificationData: 郵箱驗證資料類型
 * - ProfileUpdateData: 資料更新類型
 * - MFAData: 多因素認證資料類型
 * - AccountLinkData: 帳號連結資料類型
 * - ReauthData: 重新認證資料類型
 * - SessionData: 會話資料類型
 * - TokenData: Token 資料類型
 * 
 * 類型特性：
 * - 嚴格的類型檢查
 * - 完整的類型覆蓋
 * - 清晰的類型關係
 * - 易於擴展和維護
 * 
 * 使用方式：
 * ```tsx
 * import type { AuthState, LoginCredentials } from '@/lib/types/auth';
 * const credentials: LoginCredentials = { email, password };
 * ```
 */

// 認證相關類型定義將在這裡