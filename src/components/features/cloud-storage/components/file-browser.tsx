
'use client';

import type { FC } from 'react';
import type { StorageFile } from '../types/storage.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { File, MoreVertical, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteFileAction } from '../actions/storage.actions';

interface FileBrowserProps {
  files: StorageFile[];
  isLoading: boolean;
}

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export const FileBrowser: FC<FileBrowserProps> = ({ files, isLoading }) => {
    const { toast } = useToast();

    const handleDelete = async (filePath: string) => {
        const result = await deleteFileAction(filePath);
        if (result.success) {
            toast({ title: '成功', description: '檔案已刪除。' });
        } else {
            toast({ variant: 'destructive', title: '錯誤', description: result.error });
        }
    };

    if (isLoading) {
        return (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-t-lg" />
                        <CardFooter className="p-2">
                             <div className="h-4 bg-muted rounded w-3/4" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (files.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <File className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">無任何檔案</h3>
                <p className="mt-1 text-sm text-muted-foreground">點擊右上角的按鈕開始上傳檔案。</p>
            </div>
        );
    }
  
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
                <Card key={file.fullPath} className="group relative">
                    <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted rounded-t-lg">
                        {file.contentType.startsWith('image/') ? (
                            <Image src={file.url} alt={file.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                        ) : (
                            <File className="h-16 w-16 text-muted-foreground" />
                        )}
                    </CardContent>
                    <CardFooter className="p-2 flex-col items-start text-sm">
                        <p className="font-semibold truncate w-full">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </CardFooter>
                     <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreVertical className="h-4 w-4" />
                                     </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            刪除
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        此操作無法復原。這將永久刪除檔案「{file.name}」。
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(file.fullPath)}>繼續刪除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            ))}
        </div>
    )
};
