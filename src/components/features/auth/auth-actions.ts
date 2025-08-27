import { auth } from '@/lib/firebase-client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
  type UserCredential,
  type AuthError,
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
    } else if (error.code === 'auth/weak-password') {
      return { success: false, error: '密碼強度不足，請使用更強的密碼。' };
    } else if (error.code === 'auth/invalid-email') {
      return { success: false, error: '電子郵件地址格式不正確。' };
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
    } else if (error.code === 'auth/user-disabled') {
      return { success: false, error: '此帳戶已被停用。' };
    } else if (error.code === 'auth/too-many-requests') {
      return { success: false, error: '登入嘗試次數過多，請稍後再試。' };
    }
    return { success: false, error: '登入失敗，請稍後再試。' };
  }
}

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  
  // 添加額外的 scope 和自定義參數
  provider.addScope('profile');
  provider.addScope('email');
  
  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error: any) {
    // 根據 Firebase 官方文檔處理錯誤
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('登入流程被使用者中斷。');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('此電子郵件地址已使用其他方式註冊。');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('彈出視窗被瀏覽器阻擋，請允許彈出視窗後重試。');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('登入請求被取消。');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('登入流程被使用者中斷。');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('網路連線失敗，請檢查網路連線。');
    }
    
    // 重新拋出錯誤，讓上層處理
    throw error;
  }
}
