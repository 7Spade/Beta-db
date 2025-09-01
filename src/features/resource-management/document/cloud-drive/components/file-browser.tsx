/**
 * @fileoverview File Browser Component
 * @description 顯示檔案和資料夾的網格視圖。
 */
'use client';

import type { StorageItem } from '@/features/resource-management/document/cloud-drive/types/storage.types';
import { Skeleton } from '@/ui/skeleton';
import { File } from 'lucide-react';
import type { FC } from 'react';
import { FileCard } from './file-card';
import { FolderCard } from './folder-card';

interface FileBrowserProps {
  items: StorageItem[];
  isLoading: boolean;
  onItemClick: (item: StorageItem) => void;
  onDeleteItem: (item: StorageItem) => void;
  onRenameItem: (item: StorageItem) => void;
}

export const FileBrowser: FC<FileBrowserProps> = ({ items, isLoading, onItemClick, onDeleteItem, onRenameItem }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <File className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">這個資料夾是空的</h3>
        <p className="mt-1 text-sm text-muted-foreground">點擊右上角的按鈕來上傳檔案或建立新資料夾。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) =>
        item.type === 'folder' ? (
          <FolderCard key={item.fullPath} folder={item} onClick={() => onItemClick(item)} onDelete={() => onDeleteItem(item)} onRename={() => onRenameItem(item)} />
        ) : (
          <FileCard key={item.fullPath} file={item} onDelete={() => onDeleteItem(item)} onRename={() => onRenameItem(item)} onOpen={() => onItemClick(item)} />
        )
      )}
    </div>
  );
};
