/**
 * @fileoverview File Card Component
 * @description 顯示單一檔案的卡片 UI。
 */
'use client';

import { getSignedUrl } from '@/features/(document-management)/cloud-drive/actions/storage-actions';
import type { StorageItem } from '@/features/(document-management)/cloud-drive/types/storage.types';
import { Button } from '@/ui/button';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { formatBytes } from '@/utils';
import { Download, Edit, Eye, File as FileIcon, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

interface FileCardProps {
  file: StorageItem;
  onDelete: () => void;
  onRename: () => void;
  onOpen?: () => void;
}

export const FileCard: FC<FileCardProps> = ({ file, onDelete, onRename, onOpen }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // 只有當滑鼠懸停且檔案是圖片時，才去獲取 URL
    if (isHovered && file.contentType?.startsWith('image/') && !previewUrl) {
      getSignedUrl(file.fullPath).then(result => {
        if (result.url) {
          setPreviewUrl(result.url);
        }
      });
    }
  }, [isHovered, file, previewUrl]);

  const handlePreview = async () => {
    if (onOpen) {
      onOpen();
    }
  };

  const handleDownload = async () => {
    const result = await getSignedUrl(file.fullPath);
    if (result.url) {
      // 透過在新分頁開啟來觸發下載
      window.open(result.url, '_blank');
    }
  };

  const isImage = file.contentType?.startsWith('image/');

  return (
    <Card
      className="transition-all duration-200 hover:shadow-md group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted rounded-t-lg cursor-pointer" onClick={handlePreview}>
        {isImage && previewUrl ? (
          <Image
            src={previewUrl}
            alt={file.name}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-lg"
            data-ai-hint="file image"
          />
        ) : (
          <FileIcon className="h-10 w-10 text-muted-foreground" />
        )}
      </CardContent>
      <CardFooter className="p-2">
        <div className="w-full flex flex-col items-start">
          <span className="text-sm font-medium truncate w-full" title={file.name}>
            {file.name}
          </span>
          <span className="text-xs text-muted-foreground">{formatBytes(file.size || 0)}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" /> 預覽
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> 下載
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRename}>
              <Edit className="mr-2 h-4 w-4" /> 重新命名
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> 刪除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
