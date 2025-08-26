'use server';

import { auth } from '@/lib/firebase-client';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    type User
} from 'firebase/auth';
import type { LoginValues, RegisterValues } from './auth-form-schemas';


export interface AuthActionResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export async function registerWithEmail(data: RegisterValues): Promise<AuthActionResponse> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        // TODO: Send verification email
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        // Map Firebase error codes to user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, error: '這個電子郵件地址已經被註冊了。' };
        }
        return { success: false, error: '註冊失敗，請稍後再試。' };
    }
}

export async function signInWithEmail(data: LoginValues): Promise<AuthActionResponse> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            return { success: false, error: '電子郵件或密碼不正確。' };
        }
        return { success: false, error: '登入失敗，請稍後再試。' };
    }
}

export async function signInWithGoogle(): Promise<AuthActionResponse> {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user };
    } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user') {
            return { success: false, error: '登入流程被使用者中斷。' };
        }
        return { success: false, error: 'Google 登入失敗，請稍後再試。' };
    }
}
