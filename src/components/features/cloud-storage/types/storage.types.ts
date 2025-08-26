
export interface StorageItem {
  name: string;
  fullPath: string;
  type: 'file' | 'folder';
  size?: number;
  contentType?: string;
  createdAt?: string;
  url?: string;
  // 移除 id 和 parentPath，因為我們可以從 fullPath 推斷
}

export interface StorageAction {
  success: boolean;
  error?: string;
}

export interface StorageListResult {
  items: StorageItem[];
  error?: string;
}

// 新增：虛擬資料夾結構
export interface VirtualFolder {
  name: string;
  path: string;
  hasChildren: boolean;
  children: (StorageItem | VirtualFolder)[];
}
