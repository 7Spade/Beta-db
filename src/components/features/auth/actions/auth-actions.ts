/**
 * @fileoverview 身份驗證相關的 Server Actions
 * @description 處理如登入、註冊、登出等後端邏輯。
 */
'use server';

import { auth } from '@/lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import type { AuthActionResponse } from '../types';
import type { LoginValues, RegisterValues } from '../forms';

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
