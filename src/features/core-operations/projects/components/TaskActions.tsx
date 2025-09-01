'use client';

import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { MoreVertical, Plus, Sparkles, Trash2 } from 'lucide-react';
import * as React from 'react';

interface TaskActionsProps {
  onShowAISuggestions: () => void;
  onStartAddTask: () => void;
  onDeleteTask: () => void;
}

export function TaskActions({
  onShowAISuggestions,
  onStartAddTask,
  onDeleteTask,
}: TaskActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up to TaskItem
      >
        <DropdownMenuItem onClick={onShowAISuggestions}>
          <Sparkles className="mr-2 h-4 w-4" />
          <span>AI 建議子任務</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStartAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          <span>手動新增子任務</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDeleteTask} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>刪除此任務</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
