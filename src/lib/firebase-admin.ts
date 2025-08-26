// src/lib/firebase-admin.ts
/**
 * @fileoverview Firebase Admin SDK Initialization
 * @description This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (e.g., Server Actions, Genkit flows).
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK for the server
if (!admin.apps.length) {
  // 最现代化的配置方式：使用环境变量 + 自动检测
  const config: admin.AppOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'elite-chiller-455712-c4',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'elite-chiller-455712-c4.firebasestorage.app',
  };

  // 在 Google Cloud 环境中，使用默认凭据
  // 在本地环境中，尝试加载服务账户文件
  try {
    const serviceAccount = require('../../serviceAccountKey.json');
    config.credential = admin.credential.cert(serviceAccount);
  } catch (error) {
    // 如果服务账户文件不存在，使用默认凭据（仅在 Google Cloud 环境中有效）
    config.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(config);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
