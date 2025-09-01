/**
 * @fileoverview File Selector Component for DocuParse
 * @description Allows users to browse through the cloud storage and select a file for parsing.
 */
'use client';

import { SUPPORTED_FILE_TYPES, type SupportedFileType } from '@/features/automation-tools/docu-parse/constants';
import { listItems } from '@/features/resource-management/document/cloud-drive/actions/storage-actions';
import type { StorageItem } from '@/features/resource-management/document/cloud-drive/types/storage.types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/ui/breadcrumb';
import { Card, CardContent } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { File as FileIcon, Folder } from 'lucide-react';
import * as React from 'react';

interface FileSelectorProps {
  onFileSelect: (filePath: string) => void;
}

export function FileSelector({ onFileSelect }: FileSelectorProps) {
  const [items, setItems] = React.useState<StorageItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPath, setCurrentPath] = React.useState('');
  const { toast } = useToast();

  const fetchItems = React.useCallback(async (path: string) => {
    setIsLoading(true);
    const result = await listItems(path);
    if (result.error) {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
      setItems([]);
    } else {
      setItems(result.items);
    }
    setIsLoading(false);
  }, [toast]);

  React.useEffect(() => {
    fetchItems(currentPath);
  }, [currentPath, fetchItems]);

  const handleItemClick = (item: StorageItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.fullPath);
    } else {
      if (item.contentType && SUPPORTED_FILE_TYPES.includes(item.contentType as SupportedFileType)) {
        onFileSelect(item.fullPath);
      } else {
        toast({
          variant: 'destructive',
          title: '不支援的檔案類型',
          description: `僅支援 ${SUPPORTED_FILE_TYPES.join(', ')} 格式的檔案。`,
        });
      }
    }
  };

  const breadcrumbItems = React.useMemo(() => {
    const segments = currentPath.split('/').filter(Boolean);
    const crumbs = [{ name: '根目錄', path: '' }];
    let pathAccumulator = '';
    for (const segment of segments) {
      pathAccumulator += (pathAccumulator ? '/' : '') + segment;
      crumbs.push({ name: segment, path: pathAccumulator });
    }
    return crumbs;
  }, [currentPath]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">請從雲端硬碟選擇一個檔案進行解析</h3>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => setCurrentPath(item.path)} className="cursor-pointer">
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="border rounded-lg p-4 h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.fullPath}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className="w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.type === 'file' && !SUPPORTED_FILE_TYPES.includes(item.contentType as SupportedFileType)}
                  >
                    {item.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>{item.name}</span>
                    {item.type === 'file' && !SUPPORTED_FILE_TYPES.includes(item.contentType as SupportedFileType) && (
                      <span className="text-xs text-destructive/80 ml-auto">(不支援)</span>
                    )}
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <div className="text-center text-muted-foreground pt-16">此資料夾是空的</div>
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
