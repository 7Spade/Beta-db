/**
 * @fileoverview Cloud Drive View Component
 * @description The main view that assembles the Cloud Drive UI.
 */
'use client';

import { createFolder, deleteItem, getSignedUrl, listItems, renameItem } from '@/cloud-drive/actions/storage-actions';
import { FileBrowser } from '@/cloud-drive/components/file-browser';
import { UploadButton } from '@/cloud-drive/components/upload-button';
import type { StorageItem } from '@/cloud-drive/types/storage.types';
import DocumentPreview from '@/components/layout/shared/document-preview';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/ui/breadcrumb';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { FolderPlus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

export function CloudDriveView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [items, setItems] = React.useState<StorageItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [itemToDelete, setItemToDelete] = React.useState<StorageItem | null>(null);
  const [itemToRename, setItemToRename] = React.useState<StorageItem | null>(null);
  const [isCreateFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [newItemName, setNewItemName] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const currentPath = React.useMemo(() => searchParams.get('path') || '', [searchParams]);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    const result = await listItems(currentPath);
    if (result.error) {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
      setItems([]);
    } else {
      setItems(result.items);
    }
    setIsLoading(false);
  }, [currentPath, toast]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleNavigate = (path: string) => {
    router.push(`${pathname}?path=${path}`);
  };

  const handleItemClick = async (item: StorageItem) => {
    if (item.type === 'folder') {
      handleNavigate(item.fullPath);
    } else {
      // 對於文件，獲取簽名 URL 並顯示預覽
      const { url, error } = await getSignedUrl(item.fullPath);
      if (error || !url) {
        toast({ variant: 'destructive', title: '無法預覽', description: error || '取得檔案連結失敗。' });
        setPreviewUrl(null);
        return;
      }
      setPreviewUrl(url);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const result = await deleteItem(itemToDelete.fullPath, itemToDelete.type);
    if (result.success) {
      toast({ title: '成功', description: '項目已刪除。' });
      fetchItems();
    } else {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
    }
    setItemToDelete(null);
  };

  const handleOpenRenameDialog = (item: StorageItem) => {
    setItemToRename(item);
    setNewItemName(item.name);
  };

  const handleConfirmRename = async () => {
    if (!itemToRename || !newItemName) return;
    const result = await renameItem(itemToRename.fullPath, newItemName, itemToRename.type);
    if (result.success) {
      toast({ title: '成功', description: '項目已重新命名。' });
      fetchItems();
    } else {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
    }
    setItemToRename(null);
    setNewItemName('');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    const normalizedCurrentPath = currentPath.replace(/^\/+|\/+$/g, '');
    const fullPath = normalizedCurrentPath ? `${normalizedCurrentPath}/${newFolderName}` : newFolderName;
    const result = await createFolder(fullPath);
    if (result.success) {
      toast({ title: '成功', description: `資料夾 "${newFolderName}" 已建立。` });
      setNewFolderName('');
      setCreateFolderOpen(false);
      fetchItems();
    } else {
      toast({ variant: 'destructive', title: '錯誤', description: result.error });
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">雲端硬碟</h1>
          <p className="text-muted-foreground">管理您的檔案和資料夾。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> 新增資料夾
          </Button>
          <UploadButton currentPath={currentPath} onUploadComplete={fetchItems} />
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleNavigate(item.path)} className="cursor-pointer">
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>檔案瀏覽器</CardTitle>
        </CardHeader>
        <CardContent>
          <FileBrowser
            items={items}
            isLoading={isLoading}
            onItemClick={handleItemClick}
            onDeleteItem={(item) => setItemToDelete(item)}
            onRenameItem={handleOpenRenameDialog}
          />
        </CardContent>
      </Card>

      {previewUrl && (
        <Card>
          <CardHeader>
            <CardTitle>預覽</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[70vh]">
              <DocumentPreview src={previewUrl} className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。這將永久刪除「{itemToDelete?.name}」。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>繼續</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!itemToRename} onOpenChange={(open) => !open && setItemToRename(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>重新命名</AlertDialogTitle>
            <AlertDialogDescription>
              為「{itemToRename?.name}」輸入一個新名稱。
            </AlertDialogDescription>
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
              className="mt-4"
              autoFocus
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToRename(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRename}>儲存</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCreateFolderOpen} onOpenChange={setCreateFolderOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>建立新資料夾</AlertDialogTitle>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="輸入資料夾名稱..."
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateFolder}>建立</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
