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
  "projectId": "elite-chiller-455712-c4",
  "appId": "1:7807661688:web:cbf779797bd21f5a1d1f8d",
  "storageBucket": "elite-chiller-455712-c4.firebasestorage.app",
  "apiKey": "AIzaSyCJ-eayGjJwBKsNIh3oEAG2GjbfTrvAMEI",
  "authDomain": "elite-chiller-455712-c4.firebaseapp.com",
  "measurementId": "G-3FLE19K97P",
  "messagingSenderId": "7807661688"
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
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          "6Lcae64rAAAAAGN1IOyTBbbAleUQC2nFdb6pxx_0"
        ),
        isTokenAutoRefreshEnabled: true,
      });
    })
    .catch((err) => {
      console.error("Failed to initialize Firebase App Check", err);
    });
}

export { app, firestore, storage, auth, functions, analytics };
