'use client';

import { auth } from '@/lib/db/firebase-client/firebase-client';
import {
  signInWithEmailAndPassword,
  type User,
  type AuthError,
} from 'firebase/auth';
import type { LoginValues } from './auth-form-schemas';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/db/firebase-client/firebase-client';

// 类型守卫函数
function isFirebaseAuthError(error: unknown): error is AuthError {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

export interface AuthActionResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// We keep createUserProfile for client usage to ensure profile exists

export async function signInWithEmail(
  data: LoginValues
): Promise<AuthActionResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    if (isFirebaseAuthError(error)) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        return { success: false, error: '電子郵件或密碼不正確。' };
      } else if (error.code === 'auth/user-disabled') {
        return { success: false, error: '此帳戶已被停用。' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: '登入嘗試次數過多，請稍後再試。' };
      }
    }
    return { success: false, error: '登入失敗，請稍後再試。' };
  }
}

/**
 * Creates a user profile document in Firestore if it doesn't already exist.
 * This is used for both email and Google sign-in.
 */
export async function createUserProfile(
  user: User
): Promise<{ success: boolean; error?: string }> {
  const userRef = doc(firestore, 'users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // Document doesn't exist, create it
      await setDoc(userRef, {
        displayName:
          user.displayName || user.email?.split('@')[0] || 'New User',
        email: user.email,
        role: 'Member', // Default role
        status: 'pending', // Default status for new users
        createdAt: serverTimestamp(),
        approvedAt: null,
        approvedBy: null,
      });
    }
    // If doc exists, do nothing. The profile is already there.
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `建立用戶設定檔失敗: ${errorMessage}` };
  }
}
