'use client';

import { useState, type FC } from 'react';
import { File, Folder, MoreVertical, Download, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatBytes } from '@/lib/utils';
import type { StorageItem } from '../types/storage.types';

interface StorageItemCardProps {
  item: StorageItem;
  onNavigate?: (path: string) => void;
  onDelete?: (path: string, type: 'file' | 'folder') => void;
  onRename?: (path: string, name: string, type: 'file' | 'folder') => void;
}

export const StorageItemCard: FC<StorageItemCardProps> = ({ 
  item, 
  onNavigate, 
  onDelete, 
  onRename 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDoubleClick = () => {
    if (item.type === 'folder' && onNavigate) {
      onNavigate(item.fullPath);
    }
  };

  const handleDownload = () => {
    if (item.type === 'file' && item.url) {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name;
      link.click();
    }
  };

  const handleOpen = () => {
    if (item.type === 'file' && item.url) {
      window.open(item.url, '_blank');
    }
  };

  const getIcon = () => {
    if (item.type === 'folder') {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }
    
    // 根據檔案類型顯示不同圖標
    if (item.contentType?.startsWith('image/')) {
      return <div className="h-8 w-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">IMG</div>;
    }
    if (item.contentType?.startsWith('video/')) {
      return <div className="h-8 w-8 bg-gradient-to-br from-red-400 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">VID</div>;
    }
    if (item.contentType?.startsWith('audio/')) {
      return <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">AUD</div>;
    }
    if (item.contentType?.includes('pdf')) {
      return <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">PDF</div>;
    }
    
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getSizeText = () => {
    if (item.type === 'folder') return '資料夾';
    if (item.size) return formatBytes(item.size);
    return '未知大小';
  };

  const getDateText = () => {
    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString('zh-TW');
    }
    return item.type === 'folder' ? '虛擬資料夾' : '未知時間';
  };

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer hover:shadow-md group ${
        isHovered ? 'ring-2 ring-primary/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {getIcon()}
          <div className="w-full">
            <h3 className="font-medium text-sm truncate" title={item.name}>
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {getSizeText()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateText()}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {item.type === 'folder' ? '雙擊開啟' : '右鍵選單'}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item.type === 'file' && item.url && (
                <>
                  <DropdownMenuItem onClick={handleOpen}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    開啟
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    下載
                  </DropdownMenuItem>
                </>
              )}
              {onRename && (
                <DropdownMenuItem onClick={() => onRename(item.fullPath, item.name, item.type)}>
                  <Edit className="mr-2 h-4 w-4" />
                  重新命名
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(item.fullPath, item.type)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  刪除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};
