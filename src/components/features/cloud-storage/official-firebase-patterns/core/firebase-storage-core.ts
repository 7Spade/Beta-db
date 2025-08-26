/**
 * Firebase Cloud Storage Core Implementation
 * Based on Official Firebase Documentation Patterns
 * 
 * This file provides the core Firebase Storage functionality following
 * official Firebase best practices and patterns.
 */

import { getStorage, ref, StorageReference } from 'firebase/storage';
import { app } from '@/lib/firebase-client';

/**
 * Firebase Storage Core Class
 * Implements official Firebase Storage patterns for initialization and reference management
 */
export class FirebaseStorageCore {
  private static instance: FirebaseStorageCore;
  private storage: ReturnType<typeof getStorage>;

  private constructor() {
    // Initialize Firebase Storage using the official pattern
    this.storage = getStorage(app);
  }

  /**
   * Singleton pattern for Firebase Storage Core
   */
  public static getInstance(): FirebaseStorageCore {
    if (!FirebaseStorageCore.instance) {
      FirebaseStorageCore.instance = new FirebaseStorageCore();
    }
    return FirebaseStorageCore.instance;
  }

  /**
   * Get the Firebase Storage instance
   */
  public getStorage() {
    return this.storage;
  }

  /**
   * Create a root storage reference
   * Official pattern: FirebaseStorage.instance.ref()
   */
  public getRootReference(): StorageReference {
    return ref(this.storage);
  }

  /**
   * Create a storage reference for a specific path
   * Official pattern: storageRef.child("path/to/file")
   */
  public createReference(path: string): StorageReference {
    return ref(this.storage, path);
  }

  /**
   * Create a reference from a Google Cloud Storage URI
   * Official pattern: FirebaseStorage.instance.refFromURL("gs://bucket/path")
   */
  public createReferenceFromURL(gsUrl: string): StorageReference {
    return ref(this.storage, gsUrl);
  }

  /**
   * Create a reference from an HTTPS URL
   * Official pattern: FirebaseStorage.instance.refFromURL("https://...")
   */
  public createReferenceFromHTTPS(httpsUrl: string): StorageReference {
    return ref(this.storage, httpsUrl);
  }

  /**
   * Get storage bucket information
   */
  public getBucketInfo() {
    return {
      bucket: this.storage.app.options.storageBucket,
      app: this.storage.app.name
    };
  }
}

/**
 * Default export for easy importing
 */
export const firebaseStorageCore = FirebaseStorageCore.getInstance();

/**
 * Utility functions following official Firebase patterns
 */
export const createStorageReference = (path: string): StorageReference => {
  return firebaseStorageCore.createReference(path);
};

export const getRootStorageReference = (): StorageReference => {
  return firebaseStorageCore.getRootReference();
};

export const createReferenceFromGS = (gsUrl: string): StorageReference => {
  return firebaseStorageCore.createReferenceFromURL(gsUrl);
};

export const createReferenceFromHTTPS = (httpsUrl: string): StorageReference => {
  return firebaseStorageCore.createReferenceFromHTTPS(httpsUrl);
};