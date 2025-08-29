/**
 * @fileoverview TypeScript types for the Cloud Drive feature.
 * @description Defines the shapes of data objects used throughout the module.
 */

export interface StorageItem {
  name: string;
  fullPath: string;
  type: 'file' | 'folder';
  size?: number;
  contentType?: string;
  createdAt?: string;
}

export interface StorageAction {
  success: boolean;
  error?: string;
}

export interface StorageListResult {
  items: StorageItem[];
  error?: string;
}
