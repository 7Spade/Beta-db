
'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FolderPlus } from 'lucide-react';

import { useStorageFiles } from '../hooks/use-storage-files';
import { FileBrowser } from '../components/file-browser';
import { UploadButton } from '../components/upload-button';
import { RenameDialog } from '../components/rename-dialog';
import { CreateFolderDialog } from '../components/create-folder-dialog';
import { deleteFileAction, deleteFolderAction, renameFileAction, createFolderAction } from '../actions/storage.actions';

function CloudStorageViewInternal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const currentPath = useMemo(() => searchParams.get('path') || 'uploads', [searchParams]);
    const { files, folders, isLoading, error, refresh } = useStorageFiles(currentPath);
    
    // State for dialogs
    const [isRenameOpen, setRenameOpen] = useState(false);
    const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);
    const [itemToRename, setItemToRename] = useState<{ path: string, name: string } | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ path: string, type: 'file' | 'folder' } | null>(null);

    const handleNavigate = (path: string) => {
        router.push(`${pathname}?path=${path}`);
    };

    const breadcrumbItems = useMemo(() => {
        const segments = currentPath.split('/').filter(Boolean);
        const items = [{ name: '根目錄', path: 'uploads' }];
        let path = '';
        segments.forEach((segment, index) => {
            if (index > 0) {
                 path += `/${segment}`;
            } else {
                 path = segment;
            }
            items.push({ name: segment, path: path });
        });
        return items;
    }, [currentPath]);

    const handleRename = (path: string, currentName: string) => {
        setItemToRename({ path, name: currentName });
        setRenameOpen(true);
    };
    
    const handleConfirmRename = async (newName: string) => {
        if (!itemToRename) return;
        
        const oldPath = itemToRename.path;
        const newPath = `${oldPath.substring(0, oldPath.lastIndexOf('/'))}/${newName}`;

        const result = await renameFileAction(oldPath, newPath);
        if (result.success) {
            toast({ title: '成功', description: '重新命名成功。' });
            refresh();
        } else {
            toast({ variant: 'destructive', title: '錯誤', description: result.error });
        }
    };
    
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        
        const result = itemToDelete.type === 'file' 
            ? await deleteFileAction(itemToDelete.path)
            : await deleteFolderAction(itemToDelete.path);
        
        if(result.success) {
            toast({ title: '成功', description: `${itemToDelete.type === 'file' ? '檔案' : '資料夾'}已刪除。` });
            refresh();
        } else {
             toast({ variant: 'destructive', title: '錯誤', description: result.error });
        }
        setItemToDelete(null);
    }
    
    const handleCreateFolder = async (folderName: string) => {
        const newFolderPath = `${currentPath}/${folderName}`;
        const result = await createFolderAction(newFolderPath);
        if (result.success) {
            toast({ title: '成功', description: `資料夾 "${folderName}" 已建立。` });
            refresh();
        } else {
            toast({ variant: 'destructive', title: '錯誤', description: result.error });
        }
    };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">雲端儲存</h1>
              <p className="text-muted-foreground">管理您在 Firebase Storage 中的所有檔案。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                新增資料夾
            </Button>
            <UploadButton onUploadComplete={refresh} currentPath={currentPath} />
          </div>
        </div>

         <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={item.path}>
                        {index < breadcrumbItems.length - 1 ? (
                            <>
                                <BreadcrumbLink onClick={() => handleNavigate(item.path)} className="cursor-pointer">
                                    {item.name}
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </>
                        ) : (
                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
        
        <Card>
          <CardHeader>
            <CardTitle>檔案瀏覽器</CardTitle>
            <CardDescription>
              雙擊資料夾以開啟，在檔案或資料夾上點擊右鍵以查看更多選項。
            </CardDescription>
          </CardHeader>
          <CardContent>
              {error && <p className="text-destructive text-center">{error}</p>}
              <FileBrowser 
                files={files}
                folders={folders}
                isLoading={isLoading}
                onNavigate={handleNavigate}
                onDeleteFile={(path) => setItemToDelete({ path, type: 'file' })}
                onDeleteFolder={(path) => setItemToDelete({ path, type: 'folder' })}
                onRename={handleRename}
              />
          </CardContent>
        </Card>
      </div>
      
      {itemToRename && (
          <RenameDialog
            isOpen={isRenameOpen}
            onOpenChange={setRenameOpen}
            onRename={handleConfirmRename}
            currentName={itemToRename.name}
          />
      )}
      
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreate={handleCreateFolder}
      />

       <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                    <AlertDialogDescription>
                        此操作無法復原。這將永久刪除此 {itemToDelete?.type === 'file' ? '檔案' : '資料夾及其所有內容'}。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>繼續刪除</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

export function CloudStorageView() {
    return (
        <Suspense fallback={<div>載入中...</div>}>
            <CloudStorageViewInternal />
        </Suspense>
    );
}

