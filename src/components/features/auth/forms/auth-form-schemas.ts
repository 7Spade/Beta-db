/**
 * @fileoverview Zod 驗證 Schema
 * @description 為所有身份驗證相關的表單（登入、註冊等）提供統一的驗證規則。
 */
import { z } from 'zod';

// 登入表單的驗證規則
export const loginSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址。'),
  password: z.string().min(1, '密碼不能為空。'),
});

// 註冊表單的驗證規則
export const registerSchema = z.object({
    email: z.string().email('請輸入有效的電子郵件地址。'),
    password: z.string().min(8, '密碼長度至少需要 8 個字元。'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不相符",
    path: ["confirmPassword"], // 在哪個欄位顯示錯誤
});
