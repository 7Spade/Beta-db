// src/lib/firebase-admin.ts
/**
 * @fileoverview Firebase Admin SDK Initialization
 * @description This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (e.g., Server Actions, Genkit flows).
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK for the server
if (!admin.apps.length) {
  admin.initializeApp({
    // Note: In a real production environment on Google Cloud (like Cloud Run or Cloud Functions),
    // you often don't need to pass credentials manually. The SDK can automatically
    // detect the service account credentials from the environment.
    // The storageBucket and other configs are automatically inferred from the project context.
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
