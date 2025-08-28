/**
 * 错误类型定义和类型守卫函数
 */

// Firebase 错误类型
export interface FirebaseError {
  code: string;
  message: string;
  stack?: string;
}

// API 错误类型
export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

// 通用错误类型
export interface GenericError {
  message: string;
  code?: string;
  details?: unknown;
}

// 类型守卫函数
export function isFirebaseError(error: unknown): error is FirebaseError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

export function isApiError(error: unknown): error is ApiError {
  return error && typeof error === 'object' && 'error' in error && 'code' in error;
}

export function isGenericError(error: unknown): error is GenericError {
  return error && typeof error === 'object' && 'message' in error;
}

// 统一的错误处理函数
export function handleError(error: unknown): never {
  if (isFirebaseError(error)) {
    throw new Error(`Firebase error: ${error.message}`);
  }
  if (isApiError(error)) {
    throw new Error(`API error: ${error.error}`);
  }
  if (isGenericError(error)) {
    throw new Error(error.message);
  }
  throw new Error('Unknown error occurred');
}

// 安全的错误消息提取
export function getErrorMessage(error: unknown): string {
  if (isFirebaseError(error)) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.error;
  }
  if (isGenericError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
