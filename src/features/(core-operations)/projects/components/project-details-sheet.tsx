'use client';

import type { Project } from '@/features/(core-operations)/projects/types';
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
}

export function ProjectDetailsSheet({
  project,
  isOpen,
  onOpenChange,
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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader>
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            <SheetDescription>{project.description}</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-4">
            <ProjectHeader project={project} />
            <AddTaskForm project={project} />
            <TaskList project={project} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
