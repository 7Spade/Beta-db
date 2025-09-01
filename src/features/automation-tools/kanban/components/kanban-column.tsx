
"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { Input } from "@/ui/input";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Column, type Task } from "@root/src/features/automation-tools/kanban/types";
import { cva } from "class-variance-authority";
import { GripVertical, MoreVertical, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanCard } from "./kanban-card";


interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function KanbanColumn({ column, tasks, onAddTask, onDeleteTask, onDeleteColumn }: KanbanColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const containerStyle = cva(
    "w-full max-w-sm flex flex-col flex-shrink-0 h-full",
    {
      variants: {
        dragging: {
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id as string, newTaskTitle.trim());
      setNewTaskTitle('');
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={containerStyle({
        dragging: isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b flex flex-row items-center justify-between">
        <span className="flex-grow">{column.title} ({tasks.length})</span>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-secondary-foreground/50">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>重新命名</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">刪除欄位</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要刪除「{column.title}」嗎？</AlertDialogTitle>
              <AlertDialogDescription>此操作無法復原。這將永久刪除此欄位及其所有任務。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteColumn(column.id as string)}>繼續刪除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -mr-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move column</span>
          <GripVertical />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onDeleteTask={onDeleteTask} />
          ))}
        </SortableContext>
      </CardContent>
      <CardContent className="border-t p-4 mt-auto">
        <div className="flex items-center gap-2">
          <Input
            placeholder="新增任務..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          />
          <Button size="icon" onClick={handleAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
