// src/lib/firebase-admin.ts
/**
 * @fileoverview Firebase Admin SDK Initialization
 * @description This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (e.g., Server Actions, Genkit flows).
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK for the server
if (!admin.apps.length) {
  // 在 Firebase 平台上，尝试使用环境变量或默认配置
  const config: admin.AppOptions = {};
  
  // 如果在 Firebase 平台上运行，使用环境变量
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    config.projectId = process.env.GOOGLE_CLOUD_PROJECT;
    config.storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${process.env.GOOGLE_CLOUD_PROJECT}.firebasestorage.app`;
    
    // 在 Firebase 平台上，使用默认凭据
    config.credential = admin.credential.applicationDefault();
  } else {
    // 本地开发环境，使用服务账户文件
    try {
      const serviceAccount = require('../../serviceAccountKey.json');
      config.credential = admin.credential.cert(serviceAccount);
      config.projectId = serviceAccount.project_id;
      config.storageBucket = `${serviceAccount.project_id}.firebasestorage.app`;
    } catch (error) {
      console.warn('无法加载服务账户文件，使用默认配置');
      // 使用默认配置（仅在 Google Cloud 环境中有效）
    }
  }
  
  admin.initializeApp(config);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
