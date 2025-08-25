
'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/firebase';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import type { StorageFile, StorageFolder } from '../types/storage.types';

export function useStorageFiles(directoryPath: string) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<StorageFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const listRef = ref(storage, directoryPath);
      const res = await listAll(listRef);

      const foldersData: StorageFolder[] = res.prefixes.map(folderRef => ({
        name: folderRef.name,
        fullPath: folderRef.fullPath,
      }));

      const filesData = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          return {
            name: metadata.name,
            url: url,
            fullPath: metadata.fullPath,
            size: metadata.size,
            contentType: metadata.contentType || 'application/octet-stream',
            createdAt: metadata.timeCreated,
          };
        })
      );
      
      setFolders(foldersData);
      setFiles(filesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('獲取儲存檔案時發生錯誤:', err);
      setError('無法載入檔案。');
    } finally {
      setIsLoading(false);
    }
  }, [directoryPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, folders, isLoading, error, refresh: fetchFiles };
}
