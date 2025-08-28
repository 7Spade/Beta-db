
"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Button } from "@/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, MoreVertical } from "lucide-react";
import { type Task } from "@/kanban/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';


export interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanCard = ({ task, isOverlay, onDeleteTask }: KanbanCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const containerStyle = cva("px-3 py-2", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={containerStyle({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-0 relative flex flex-row justify-end items-center">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>編輯任務</DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>刪除任務</DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要刪除此任務嗎？</AlertDialogTitle>
              <AlertDialogDescription>此操作無法復原。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteTask(task.id as string)}>繼續刪除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="px-0 py-1 text-sm whitespace-pre-wrap">
        {task.title}
      </CardContent>
    </Card>
  );
};
