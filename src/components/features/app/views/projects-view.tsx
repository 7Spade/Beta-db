

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { CreateProjectDialog } from '@/components/features/app/create-project-dialog';
import type { Project, Task } from '@/lib/types/types';
import { ProjectDetailsSheet } from '@/components/features/app/project-details-sheet';

function calculateProgress(tasks: Task[]): { completedValue: number } {
  let completedValue = 0;

  function recurse(taskArray: Task[]) {
    taskArray.forEach(task => {
      // Only count leaf nodes for progress
      if (task.subTasks && task.subTasks.length > 0) {
        recurse(task.subTasks);
      } else {
        if (task.status === '已完成') {
          completedValue += task.value;
        }
      }
    });
  }

  recurse(tasks);
  return { completedValue };
}

interface ProjectsViewProps {
  initialProjects: Project[];
}

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSheetOpen(true);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedProjectId(null);
    }
  }

  const selectedProject = initialProjects.find(p => p.id === selectedProjectId);

  return (
    <>
      <div className="flex items-center justify-end">
        <CreateProjectDialog />
      </div>
      
      {initialProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">尚無專案</h2>
            <p className="text-muted-foreground mt-2">點擊「新增專案」以開始。</p>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialProjects.map((project) => {
          const { completedValue } = calculateProgress(project.tasks);
          const progressPercentage = project.value > 0 ? (completedValue / project.value) * 100 : 0;
          
          return (
            <Card key={project.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetails(project.id)}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                         <span className="text-sm font-medium text-muted-foreground">進度</span>
                         <span className="text-sm font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">價值 ${completedValue.toLocaleString()} / ${project.value.toLocaleString()} 已完成</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">開始日期：</span> {project.startDate ? format(project.startDate, 'yyyy-MM-dd') : '無'}</p>
                  <p><span className="font-medium text-foreground">結束日期：</span> {project.endDate ? format(project.endDate, 'yyyy-MM-dd') : '無'}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  查看詳情
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      )}
      
      {selectedProjectId && (
         <ProjectDetailsSheet project={selectedProject} isOpen={isSheetOpen} onOpenChange={handleSheetOpenChange} />
      )}
    </>
  );
}
