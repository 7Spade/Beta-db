// This file is renamed to project-details-sheet.tsx and its content is updated.
// The build system will handle the file rename.
'use client';

import { ScrollArea } from '@/ui/scroll-area';
import { Separator } from '@/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/ui/sheet';
import type { Project } from '../types';
import { AddTaskPanel } from './AddTaskPanel';
import { ProjectSummary } from './ProjectSummary';
import { TaskList } from './TaskList';

interface ProjectDetailsSheetProps {
  project: Project | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddTask: (taskTitle: string, quantity: number, unitPrice: number) => void;
  onAddSubtask: (
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string) => void;
}

export function ProjectDetailsSheet({
  project,
  isOpen,
  onOpenChange,
  onAddTask,
  onAddSubtask,
  onDeleteTask,
  onUpdateTaskStatus,
}: ProjectDetailsSheetProps) {
  if (!project) {
    // Even if project is not available, we render the sheet to handle the close animation properly.
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>找不到專案</SheetTitle>
            <SheetDescription>專案不存在或已被刪除。</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const projectWithDates = {
    ...project,
    startDate: new Date(project.startDate),
    endDate: new Date(project.endDate),
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold truncate">
            {project.title}
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground line-clamp-2">
            {project.description}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <ProjectSummary project={projectWithDates} />
            <Separator />
            <AddTaskPanel project={projectWithDates} onAddTask={onAddTask} />
            <Separator />
            <TaskList
              project={projectWithDates}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
