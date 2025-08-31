// src/lib/firebase-client.ts
/**
 * @fileoverview Firebase Client-Side SDK Initialization
 * @description This file initializes the Firebase SDK for the client-side (browser) application.
 * It should be imported by any React component or client-side script that needs to interact with Firebase services.
 */

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCJ-eayGjJwBKsNIh3oEAG2GjbfTrvAMEI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "elite-chiller-455712-c4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "elite-chiller-455712-c4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "elite-chiller-455712-c4.firebasestorage.app",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:7807661688:web:cbf779797bd21f5a1d1f8d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3FLE19K97P",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "7807661688",
};

// Initialize Firebase for the client
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Initialize Analytics only if it's supported
const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : Promise.resolve(null);

// Initialize App Check on the client only
if (typeof window !== "undefined") {
  import("firebase/app-check")
    .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfcULArAAAAAGEu9r_BXXkN3X9ceD1oqQhzcbG0";
      if (!recaptchaSiteKey) {
        console.warn("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY; App Check will initialize without a provider.");
        return;
      }
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    })
    .catch((err) => {
      console.error("Failed to initialize Firebase App Check", err);
    });
}

export { app, firestore, storage, auth, functions, analytics };
