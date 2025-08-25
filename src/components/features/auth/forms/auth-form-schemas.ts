/**
 * Auth Form Schemas - 認證表單驗證模式
 *
 * 功能說明：
 * - 使用 zod 定義所有與身份驗證相關的表單驗證規則。
 * - 這些 schema 將在前端（配合 react-hook-form）和後端（在 Server Actions 中）共用，確保資料一致性。
 */
import { z } from 'zod';

/**
 * 登入表單的驗證 schema。
 * - email: 必須是有效的電子郵件格式。
 * - password: 至少需要 1 個字元。
 */
export const loginSchema = z.object({
  email: z.string().email({
    message: '請輸入有效的電子郵件地址。',
  }),
  password: z.string().min(1, {
    message: '密碼為必填項。',
  }),
});

/**
 * 註冊表單的驗證 schema。
 * (將在後續步驟中定義)
 */
export const registerSchema = z.object({
  // ...
});

/**
 * 密碼重置表單的驗證 schema。
 * (將在後續步驟中定義)
 */
export const resetPasswordSchema = z.object({
  // ...
});
