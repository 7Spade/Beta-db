// src/lib/firebase-admin.ts
/**
 * @fileoverview Firebase Admin SDK Initialization
 * @description This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (e.g., Server Actions, Genkit flows).
 */

import admin from 'firebase-admin';

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
    const serviceAccount = require('../../serviceAccountKey.json');
    config.credential = admin.credential.cert(serviceAccount);
  } catch {
    config.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(config);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
