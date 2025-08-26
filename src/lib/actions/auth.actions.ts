/**
 * @fileoverview 身份驗證相關的 Server Actions, Zod Schemas, 和類型定義
 * @description 整合所有與身份驗證相關的後端邏輯、表單驗證規則和TypeScript類型。
 */
'use server';

import { auth } from '@/lib/firebase-client';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    type User
} from 'firebase/auth';
import { z } from 'zod';

// Zod 驗證 Schema (用於客戶端表單)
// -------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email({ message: '請輸入有效的電子郵件地址。' }),
  password: z.string().min(1, { message: '密碼不能為空。' }),
});

export const registerSchema = z.object({
    email: z.string().email({ message: '請輸入有效的電子郵件地址。' }),
    password: z.string().min(8, { message: '密碼長度至少需要 8 個字元。' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不相符",
    path: ["confirmPassword"],
});


// TypeScript 類型定義
// -------------------------------------------------

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export interface AuthActionResponse {
  success: boolean;
  user?: User;
  error?: string;
}


// Server Actions (只能在伺服器端執行)
// -------------------------------------------------

export async function registerWithEmail(data: RegisterValues): Promise<AuthActionResponse> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function signInWithEmail(data: LoginValues): Promise<AuthActionResponse> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function signInWithGoogle(): Promise<AuthActionResponse> {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
