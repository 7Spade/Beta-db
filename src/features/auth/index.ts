/**
 * @fileoverview 認證功能模組的統一導出
 * @description 匯出所有身份驗證相關的元件、函數和類型
 */

// 主要視圖元件
export { LoginView } from './login-view';
export { RegisterView } from './register-view';
export { PendingApprovalView } from './pending-approval-view';
export { VerifyEmailView } from './verify-email-view';

// 社交認證元件
export { SocialAuthButtons } from './social-auth-buttons';

// 表單驗證 Schema
export {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from './auth-form-schemas';

// Hooks
export { useAuth } from './use-auth';
