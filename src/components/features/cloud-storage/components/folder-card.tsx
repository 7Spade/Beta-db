
'use client';

import type { FC } from 'react';
import { Folder, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

interface FolderCardProps {
    name: string;
    path: string;
    onNavigate: (path: string) => void;
    onRename: (path: string, currentName: string) => void;
    onDelete: (path: string) => void;
}

export const FolderCard: FC<FolderCardProps> = ({ name, path, onNavigate, onRename, onDelete }) => {
  return (
    <ContextMenu>
        <ContextMenuTrigger>
            <Card 
                className="group relative transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
                onDoubleClick={() => onNavigate(path)}
            >
                <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted rounded-t-lg">
                    <Folder className="h-16 w-16 text-primary/70" />
                </CardContent>
                <CardFooter className="p-3">
                    <p className="font-semibold truncate w-full" title={name}>{name}</p>
                </CardFooter>
            </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onSelect={() => onNavigate(path)}>
                開啟
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onRename(path, name)}>
                <Edit className="mr-2 h-4 w-4" />
                重新命名
            </ContextMenuItem>
             <ContextMenuItem onSelect={() => onDelete(path)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
};
