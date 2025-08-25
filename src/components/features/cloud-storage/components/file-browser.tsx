
'use client';

import type { FC } from 'react';
import { File } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FileCard } from './file-card';
import { FolderCard } from './folder-card';
import type { StorageFile, StorageFolder } from '../types/storage.types';

interface FileBrowserProps {
  files: StorageFile[];
  folders: StorageFolder[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onDeleteFolder: (path: string) => void;
  onRename: (path: string, currentName: string) => void;
}

export const FileBrowser: FC<FileBrowserProps> = ({ 
    files, 
    folders, 
    isLoading, 
    onNavigate,
    onDeleteFile,
    onDeleteFolder,
    onRename
}) => {
    
    if (isLoading) {
        return (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-t-lg" />
                        <CardFooter className="p-2 mt-2">
                             <div className="h-4 bg-muted rounded w-3/4" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (files.length === 0 && folders.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <File className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">這個資料夾是空的</h3>
                <p className="mt-1 text-sm text-muted-foreground">點擊右上角的按鈕開始上傳檔案。</p>
            </div>
        );
    }
  
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
                <FolderCard 
                    key={folder.fullPath}
                    name={folder.name}
                    path={folder.fullPath}
                    onNavigate={onNavigate}
                    onRename={onRename}
                    onDelete={onDeleteFolder}
                />
            ))}
            {files.map((file) => (
                <FileCard 
                    key={file.fullPath}
                    file={file}
                    onDelete={onDeleteFile}
                    onRename={onRename}
                />
            ))}
        </div>
    )
};
