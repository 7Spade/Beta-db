
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
import type { Project, Task } from '../types';
import { AddTaskPanel } from './AddTaskPanel';
import { ProjectSummary } from './ProjectSummary';
import { TaskList } from './TaskList';
import { useState } from 'react';
import { Button } from '@/ui/button';
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from 'lucide-react';
import { CardHeader, Card, CardTitle, CardDescription } from '@/ui/card';

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

function getAllTaskIds(tasks: Task[]): string[] {
    let ids: string[] = [];
    for (const task of tasks) {
        ids.push(task.id);
        if (task.subTasks && task.subTasks.length > 0) {
            ids = ids.concat(getAllTaskIds(task.subTasks));
        }
    }
    return ids;
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
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const handleToggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    if (project) {
        const allIds = getAllTaskIds(project.tasks);
        setExpandedTasks(new Set(allIds));
    }
  };

  const handleCollapseAll = () => {
    setExpandedTasks(new Set());
  };


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
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>任務列表</CardTitle>
                            <CardDescription>專案的工作分解結構。</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleExpandAll}>
                                <ChevronsDown className="mr-2 h-4 w-4" />
                                全部展開
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                                <ChevronsUp className="mr-2 h-4 w-4" />
                                全部收起
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <TaskList
              project={projectWithDates}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              expandedTasks={expandedTasks}
              onToggleExpand={handleToggleExpand}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
