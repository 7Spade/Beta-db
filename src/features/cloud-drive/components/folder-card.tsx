/**
 * @fileoverview Folder Card Component
 * @description 顯示單一資料夾的卡片 UI。
 */
'use client';

import type { FC } from 'react';
import { Folder as FolderIcon, MoreVertical, Trash2, Edit, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Button } from '@/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/ui/dropdown-menu';
import type { StorageItem } from '@/cloud-drive/types/storage.types';

interface FolderCardProps {
  folder: StorageItem;
  onClick: () => void;
  onDelete: () => void;
  onRename: () => void;
}

export const FolderCard: FC<FolderCardProps> = ({ folder, onClick, onDelete, onRename }) => {
  return (
    <Card 
        className="transition-all duration-200 hover:shadow-md group cursor-pointer"
        onDoubleClick={onClick}
    >
      <CardContent className="p-4 aspect-square flex items-center justify-center" onClick={onClick}>
        <FolderIcon className="h-12 w-12 text-primary/70" />
      </CardContent>
      <CardFooter className="p-2">
        <div className="w-full flex items-center">
          <span className="text-sm font-medium truncate flex-1" title={folder.name}>
            {folder.name}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={onClick}>
                    <FolderOpen className="mr-2 h-4 w-4" /> 開啟
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
        </div>
      </CardFooter>
    </Card>
  );
};
