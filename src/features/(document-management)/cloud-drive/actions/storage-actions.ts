/**
 * @fileoverview 雲端硬碟功能的 Server Actions
 * @description 處理所有與 Firebase Storage 互動的伺服器端邏輯。
 */
'use server';

import type { StorageAction, StorageItem, StorageListResult } from '@/features/(document-management)/cloud-drive/types/storage.types';
import { adminStorage } from '@/lib/db/firebase-admin/firebase-admin';
import { revalidatePath } from 'next/cache';

// 從環境變數讀取儲存桶名稱，如果不存在則拋出錯誤
const BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET;
if (!BUCKET_NAME) {
  throw new Error("環境變數 FIREBASE_STORAGE_BUCKET 未設定。");
}

const bucket = adminStorage.bucket(BUCKET_NAME);

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

function getParentPath(path: string): string {
  if (!path) return '';
  const lastSlashIndex = path.lastIndexOf('/');
  return lastSlashIndex >= 0 ? path.substring(0, lastSlashIndex) : '';
}

function buildFullPath(currentPath: string, name: string): string {
  const normalizedPath = normalizePath(currentPath);
  return normalizedPath ? `${normalizedPath}/${name}` : name;
}

/**
 * 列出指定路徑下的檔案和資料夾
 */
export async function listItems(path: string): Promise<StorageListResult> {
  try {
    const normalizedPath = normalizePath(path);
    const prefix = normalizedPath ? `${normalizedPath}/` : '';

    const [files, , apiResponse] = await bucket.getFiles({
      prefix: prefix,
      delimiter: '/',
      autoPaginate: false,
      maxResults: 1000,
    });

    type GcsGetFilesResponse = { prefixes?: string[] };
    const response = (apiResponse as unknown as GcsGetFilesResponse) || {};

    const folders: StorageItem[] = (response.prefixes || []).map((folderPath: string) => ({
      name: folderPath.replace(prefix, '').replace('/', ''),
      fullPath: folderPath.slice(0, -1),
      type: 'folder',
      createdAt: new Date().toISOString(),
    }));

    const fileItems: StorageItem[] = files
      .filter(file => !file.name.endsWith('/.folder'))
      .map(file => ({
        name: file.name.split('/').pop() || '',
        fullPath: file.name,
        type: 'file',
        size: Number(file.metadata.size) || 0,
        contentType: file.metadata.contentType || 'application/octet-stream',
        createdAt: file.metadata.timeCreated,
      }));

    const allItems = [...folders, ...fileItems].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return { items: allItems };
  } catch {
    console.error('列出項目時發生錯誤');
    return { items: [], error: '無法載入檔案列表。' };
  }
}

/**
 * 建立一個新資料夾 (透過建立一個標記檔案)
 */
export async function createFolder(path: string): Promise<StorageAction> {
  try {
    const markerPath = `${normalizePath(path)}/.folder`;
    await bucket.file(markerPath).save('', { contentType: 'application/x-directory' });

    revalidatePath(`/cloud-drive?path=${getParentPath(path)}`, 'page');
    return { success: true };
  } catch {
    return { success: false, error: '建立資料夾失敗。' };
  }
}

/**
 * 刪除一個檔案或資料夾
 */
export async function deleteItem(path: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    if (type === 'folder') {
      await bucket.deleteFiles({ prefix: `${path}/` });
    } else {
      await bucket.file(path).delete();
    }

    revalidatePath(`/cloud-drive?path=${getParentPath(path)}`, 'page');
    return { success: true };
  } catch {
    return { success: false, error: '刪除失敗。' };
  }
}

/**
 * 上傳檔案
 */
export async function uploadFile(formData: FormData): Promise<StorageAction> {
  const file = formData.get('file') as File;
  const currentPath = formData.get('currentPath') as string;

  if (!file) return { success: false, error: '找不到檔案。' };

  const filePath = buildFullPath(currentPath, file.name);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(filePath).save(buffer, { contentType: file.type });

    revalidatePath(`/cloud-drive?path=${currentPath}`, 'page');
    return { success: true };
  } catch {
    return { success: false, error: '上傳失敗。' };
  }
}

/**
 * 取得檔案的簽名 URL (有時效性)
 */
export async function getSignedUrl(path: string): Promise<{ url?: string, error?: string }> {
  try {
    const [url] = await bucket.file(path).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    return { url };
  } catch {
    return { error: '無法取得下載連結。' };
  }
}

/**
 * 重新命名檔案或資料夾
 */
export async function renameItem(oldPath: string, newName: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    const parentPath = getParentPath(oldPath);
    const newPath = buildFullPath(parentPath, newName);

    if (type === 'folder') {
      const [files] = await bucket.getFiles({ prefix: `${oldPath}/` });
      for (const file of files) {
        const relativePath = file.name.substring(oldPath.length);
        const destination = `${newPath}${relativePath}`;
        await file.move(destination);
      }
    } else {
      await bucket.file(oldPath).move(newPath);
    }

    revalidatePath(`/cloud-drive?path=${parentPath}`, 'page');
    return { success: true };
  } catch {
    console.error("重新命名失敗");
    return { success: false, error: '重新命名失敗。' };
  }
}
