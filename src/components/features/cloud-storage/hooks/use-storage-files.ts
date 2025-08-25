
'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/firebase';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import type { StorageFile } from '../types/storage.types';

export function useStorageFiles(directoryPath: string = 'uploads/') {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const listRef = ref(storage, directoryPath);
      const res = await listAll(listRef);

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

  return { files, isLoading, error, refresh: fetchFiles };
}
