
'use client';

import type { FC } from 'react';
import { File } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StorageItemCard } from './storage-item-card';
import type { StorageItem } from '../types/storage.types';
import { Card, CardFooter } from '@/components/ui/card';

interface FileBrowserProps {
  items: StorageItem[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onDelete: (path: string, type: 'file' | 'folder') => void;
  onRename: (path: string, name: string, type: 'file' | 'folder') => void;
}

export const FileBrowser: FC<FileBrowserProps> = ({ 
  items, 
  isLoading, 
  onNavigate,
  onDelete,
  onRename,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-t-lg" />
            <CardFooter className="p-2 mt-2">
              <Skeleton className="h-4 bg-muted rounded w-3/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <File className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">這個資料夾是空的</h3>
        <p className="mt-1 text-sm text-muted-foreground">點擊右上角的按鈕開始上傳檔案。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 group">
      {items.map((item) => (
        <StorageItemCard 
          key={item.fullPath}
          item={item}
          onNavigate={onNavigate}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
};
