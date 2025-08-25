
'use client';

import * as React from 'react';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { useStorageFiles } from '@/components/features/cloud-storage/hooks/use-storage-files';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder, File as FileIcon } from 'lucide-react';
import { SUPPORTED_FILE_TYPES } from '../constants';
import { cn } from '@/lib/utils';


interface StorageFileSelectorDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFileSelect: (storageUrl: string, fileName: string) => void;
}

function FileBrowser({ onFileSelect }: { onFileSelect: (url: string, name: string) => void }) {
    const searchParams = useSearchParams();
    const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '');
    const { files, folders, isLoading, error } = useStorageFiles(currentPath);

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
    };

    const breadcrumbItems = useMemo(() => {
        if (!currentPath) return [{ name: '根目錄', path: '' }];
        const segments = currentPath.split('/').filter(Boolean);
        const items = [{ name: '根目錄', path: '' }];
        let path = '';
        for (const segment of segments) {
            path += `/${segment}`;
            items.push({ name: segment, path: path });
        }
        return items;
    }, [currentPath]);

    const isFileSupported = (contentType: string) => {
        return SUPPORTED_FILE_TYPES.includes(contentType as any);
    }
    
    return (
        <div className="space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                        <React.Fragment key={item.path}>
                            <BreadcrumbItem>
                                {index < breadcrumbItems.length - 1 ? (
                                    <BreadcrumbLink onClick={() => handleNavigate(item.path)} className="cursor-pointer">
                                        {item.name}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                             {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            
            <Card className="h-[400px] overflow-y-auto">
                <CardContent className="p-4">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                           {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                        </div>
                    ) : error ? (
                        <p className="text-destructive text-center">{error}</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {folders.map(folder => (
                                <Card key={folder.fullPath} className="cursor-pointer hover:bg-muted" onClick={() => handleNavigate(folder.fullPath)}>
                                    <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                                        <Folder className="h-12 w-12 text-primary/70" />
                                        <p className="mt-2 text-sm text-center truncate w-full">{folder.name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {files.map(file => (
                                <Card 
                                    key={file.fullPath}
                                    className={cn(
                                        "hover:bg-muted", 
                                        isFileSupported(file.contentType) 
                                            ? "cursor-pointer" 
                                            : "cursor-not-allowed opacity-50"
                                    )}
                                    onClick={() => isFileSupported(file.contentType) && onFileSelect(file.fullPath, file.name)}
                                >
                                     <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                                        <FileIcon className="h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-center truncate w-full" title={file.name}>{file.name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {files.length === 0 && folders.length === 0 && (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-muted-foreground">此資料夾是空的。</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


export const StorageFileSelectorDialog = ({ isOpen, onOpenChange, onFileSelect }: StorageFileSelectorDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>從雲端儲存選擇檔案</DialogTitle>
                    <DialogDescription>
                        瀏覽您的儲存空間，然後選擇一個檔案以進行解析。
                    </DialogDescription>
                </DialogHeader>
                 <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
                   <FileBrowser onFileSelect={onFileSelect} />
                </Suspense>
            </DialogContent>
        </Dialog>
    );
};
