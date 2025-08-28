// src/lib/firebase-admin.ts
/**
 * @fileoverview Firebase Admin SDK Initialization
 * @description This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (e.g., Server Actions, Genkit flows).
 */

import admin from 'firebase-admin';
import { getAppCheck } from 'firebase-admin/app-check';

// Initialize Firebase Admin SDK for the server
if (!admin.apps.length) {
  // 最简一处定义：优先使用服務端環境變數，否則回退到公開變數
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'elite-chiller-455712-c4';
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;

  const config: admin.AppOptions = {
    projectId,
    storageBucket,
  };

  // 在雲端（App Hosting/Cloud Run）會有預設憑證；本地優先 serviceAccountKey.json
  try {
    // 使用动态导入替代require
    const serviceAccount = await import('@root/serviceAccountKey.json');
    config.credential = admin.credential.cert(serviceAccount.default as admin.ServiceAccount);
  } catch {
    config.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(config);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

// 初始化App Check Admin SDK
const adminAppCheck = getAppCheck();

// App Check token验证函数（强制模式）
export const verifyAppCheckToken = async (token: string, options?: { consume?: boolean }) => {
  try {
    if (!token) {
      throw new Error('App Check token is required');
    }

    const result = await adminAppCheck.verifyToken(token, options);
    
    // 验证成功，返回解码后的token信息
    return {
      success: true,
      appId: result.appId,
      token: result.token,
      alreadyConsumed: result.alreadyConsumed || false,
      // 检查token是否过期
      isExpired: result.token.exp * 1000 < Date.now(),
      // 检查token的发行者
      issuer: result.token.iss,
      // 检查token的受众
      audience: result.token.aud,
    };
    
  } catch (error: unknown) {
    console.error('App Check token verification failed:', error);
    
    // 根据错误类型返回相应的错误信息
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
      if (error.code === 'app-check-token-invalid') {
        throw new Error('Invalid App Check token');
      } else if (error.code === 'app-check-token-expired') {
        throw new Error('App Check token has expired');
      } else if (error.code === 'app-check-token-consumed') {
        throw new Error('App Check token has already been consumed');
      }
    }
    
    // 处理其他错误
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    throw new Error(`App Check verification failed: ${errorMessage}`);
  }
};

// 创建自定义App Check token（用于测试或特殊用途）
export const createAppCheckToken = async (appId: string, options?: { ttlMillis?: number }) => {
  try {
    const token = await adminAppCheck.createToken(appId, options);
    return {
      success: true,
      token: token.token,
      ttlMillis: token.ttlMillis,
      expiresAt: new Date(Date.now() + token.ttlMillis),
    };
  } catch (error: unknown) {
    console.error('Failed to create App Check token:', error);
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    throw new Error(`Failed to create App Check token: ${errorMessage}`);
  }
};

// 强制模式中间件函数（用于API路由）
export const enforceAppCheck = async (req: { headers: Record<string, string | string[] | undefined>; body?: { appCheckToken?: string }; appCheck?: unknown }, res: { status: (code: number) => { json: (data: unknown) => void } }, next: () => void) => {
  try {
    const appCheckToken = req.headers['x-firebase-appcheck'] || req.body?.appCheckToken;
    
    if (!appCheckToken) {
      return res.status(401).json({ 
        error: 'App Check token is required',
        code: 'APP_CHECK_TOKEN_MISSING'
      });
    }

    const verificationResult = await verifyAppCheckToken(
      Array.isArray(appCheckToken) ? appCheckToken[0] : appCheckToken
    );
    
    if (!verificationResult.success) {
      return res.status(401).json({ 
        error: 'App Check verification failed',
        code: 'APP_CHECK_VERIFICATION_FAILED'
      });
    }

    // 将验证结果添加到请求对象中，供后续中间件使用
    req.appCheck = verificationResult;
    next();
    
  } catch (error: unknown) {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    return res.status(401).json({ 
      error: errorMessage,
      code: 'APP_CHECK_ERROR'
    });
  }
};

// 强制模式验证函数（用于Server Actions）
export const validateAppCheckInServerAction = async (appCheckToken: string) => {
  try {
    const result = await verifyAppCheckToken(appCheckToken);
    
    if (!result.success) {
      throw new Error('App Check validation failed');
    }
    
    // 检查token是否过期
    if (result.isExpired) {
      throw new Error('App Check token has expired');
    }
    
    // 检查是否已被消费（如果设置了consume选项）
    if (result.alreadyConsumed) {
      throw new Error('App Check token has already been consumed');
    }
    
    return result;
    
  } catch (error: unknown) {
    console.error('App Check validation in Server Action failed:', error);
    throw error;
  }
};

export { adminAuth, adminDb, adminStorage, adminAppCheck };