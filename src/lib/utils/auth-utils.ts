import type { AuthError } from 'firebase/auth';

/**
 * 类型守卫函数：检查错误是否为Firebase认证错误
 * @param error - 未知类型的错误
 * @returns 如果错误是Firebase认证错误则返回true，否则返回false
 */
export function isFirebaseAuthError(error: unknown): error is AuthError {
  if (!error || typeof error !== 'object') {
    return false;
  }
  
  if (!('code' in error) || typeof (error as any).code !== 'string') {
    return false;
  }
  
  return true;
}
