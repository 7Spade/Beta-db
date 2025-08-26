
export interface StorageItem {
  name: string;
  fullPath: string;
  type: 'file' | 'folder';
  size?: number;
  contentType?: string;
  createdAt?: string;
  url?: string;
}

export interface StorageAction {
  success: boolean;
  error?: string;
}

export interface StorageListResult {
  items: StorageItem[];
  error?: string;
}
