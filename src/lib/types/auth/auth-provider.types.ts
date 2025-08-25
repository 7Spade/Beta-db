/**
 * Auth Provider Types - 認證提供者類型定義 (lib 層)
 * 
 * 功能說明：
 * - 定義認證提供者相關的 TypeScript 類型
 * - 包含社交登入、OAuth 等提供者類型
 * - 提供統一的認證提供者介面
 * 
 * 主要類型：
 * - SocialAuthProvider: 社交登入提供者類型
 * - OAuthProvider: OAuth 提供者類型
 * - CustomAuthProvider: 自定義認證提供者類型
 * - ProviderConfig: 提供者配置類型
 * - ProviderCredential: 提供者憑證類型
 * - ProviderProfile: 提供者資料類型
 * - ProviderError: 提供者錯誤類型
 * - ProviderState: 提供者狀態類型
 * - ProviderCallback: 提供者回調類型
 * - ProviderMetadata: 提供者元資料類型
 * 
 * 支援的提供者：
 * - Google (GoogleAuthProvider)
 * - Facebook (FacebookAuthProvider)
 * - Apple (AppleAuthProvider)
 * - GitHub (GithubAuthProvider)
 * - Microsoft (MicrosoftAuthProvider)
 * - Twitter (TwitterAuthProvider)
 * - Phone (PhoneAuthProvider)
 * - Email Link (EmailAuthProvider)
 * 
 * 類型特性：
 * - 統一的提供者介面
 * - 靈活的配置選項
 * - 完整的錯誤處理
 * - 易於擴展新提供者
 * 
 * 使用方式：
 * ```tsx
 * import type { SocialAuthProvider, OAuthProvider } from '@/lib/types/auth';
 * const provider: SocialAuthProvider = 'google';
 * ```
 */

// 認證提供者類型定義將在這裡