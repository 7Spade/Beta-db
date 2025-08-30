'use client';

import type {
  Project,
  Task,
} from '@/features/(core-operations)/projects/types';
import { ScrollArea } from '@/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/ui/sheet';
import { AddTaskForm } from './add-task-form';
import { ProjectHeader } from './project-header';
import { TaskList } from './task-list';

interface ProjectDetailsSheetProps {
  project: Project | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  optimisticUpdate: (action: any) => void;
}

export function ProjectDetailsSheet({
  project,
  isOpen,
  onOpenChange,
  optimisticUpdate,
}: ProjectDetailsSheetProps) {
  if (!project) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-3xl">
          <SheetHeader>
            <SheetTitle className="text-2xl">找不到專案</SheetTitle>
            <SheetDescription>專案不存在或已被刪除。</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  // Convert string dates back to Date objects for components that need them
  const projectWithDates = {
    ...project,
    startDate: new Date(project.startDate),
    endDate: new Date(project.endDate),
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader>
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            <SheetDescription>{project.description}</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-4">
            <ProjectHeader project={projectWithDates} />
            <AddTaskForm project={projectWithDates} />
            <TaskList
              project={projectWithDates}
              optimisticUpdate={optimisticUpdate}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
