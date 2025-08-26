
'use client';

import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { File, Folder, MoreVertical, Download, Trash2, Edit, Cpu, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { formatBytes, formatDate } from '@/lib/utils';
import type { StorageItem } from '../types/storage.types';
import { getSignedUrlAction } from '../actions/storage.actions';

interface StorageItemCardProps {
  item: StorageItem;
  onNavigate: (path: string) => void;
  onDelete: (path: string, type: 'file' | 'folder') => void;
  onRename: (item: StorageItem) => void;
}

export const StorageItemCard: FC<StorageItemCardProps> = ({ item, onNavigate, onDelete, onRename }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const handleDoubleClick = () => {
    if (item.type === 'folder') {
      onNavigate(item.fullPath);
    }
  };

  const handleAction = async (action: () => Promise<{ url?: string, error?: string } | void>) => {
    setIsUrlLoading(true);
    const result = await action();
    if (result && result.url) {
      window.open(result.url, '_blank');
    } else if (result && result.error) {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
    }
    setIsUrlLoading(false);
  };
  
  const handleDocuParse = () => {
    router.push(`/docu-parse?filePath=${encodeURIComponent(item.fullPath)}`);
  };

  return (
    <Card
      className="transition-all duration-200 cursor-pointer hover:shadow-lg group"
      onDoubleClick={handleDoubleClick}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center aspect-square space-y-2">
        {item.type === 'folder' ? <Folder className="h-12 w-12 text-blue-500" /> : <File className="h-12 w-12 text-gray-500" />}
        <p className="text-sm font-medium text-center truncate w-full" title={item.name}>
          {item.name}
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <span>{item.type === 'file' ? formatBytes(item.size || 0) : '資料夾'}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onRename(item)}>
              <Edit className="mr-2 h-4 w-4" /> 重新命名
            </DropdownMenuItem>
            {item.type === 'file' && (
              <>
                <DropdownMenuItem onClick={() => handleAction(() => getSignedUrlAction(item.fullPath))}>
                  <Download className="mr-2 h-4 w-4" /> 下載
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDocuParse}>
                  <Cpu className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary">使用 DocuParse 解析</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => onDelete(item.fullPath, item.type)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> 刪除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
