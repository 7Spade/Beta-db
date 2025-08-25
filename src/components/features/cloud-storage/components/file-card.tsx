
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { File, MoreVertical, Trash2, Edit } from 'lucide-react';

import { Card, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

import type { StorageFile } from '../types/storage.types';
import { formatDate } from '@/lib/utils';

interface FileCardProps {
    file: StorageFile;
    onDelete: (path: string) => void;
    onRename: (path: string, currentName: string) => void;
}

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export const FileCard: FC<FileCardProps> = ({ file, onDelete, onRename }) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card className="group relative transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted rounded-t-lg overflow-hidden">
                        {file.contentType.startsWith('image/') ? (
                            <Image src={file.url} alt={file.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                        ) : (
                            <File className="h-16 w-16 text-muted-foreground" />
                        )}
                    </CardContent>
                    <CardFooter className="p-3 flex-col items-start text-sm">
                        <p className="font-semibold truncate w-full" title={file.name}>{file.name}</p>
                        <CardDescription>{formatBytes(file.size)} - {formatDate(file.createdAt)}</CardDescription>
                    </CardFooter>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onSelect={() => onRename(file.fullPath, file.name)}>
                    <Edit className="mr-2 h-4 w-4" />
                    重新命名
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onDelete(file.fullPath)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    刪除
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
