'use client';

import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { ProjectDetailsSheet } from '@/features/projects/components/project-details-sheet';
import type { Project, Task } from '@/features/projects/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
} from 'firebase/firestore';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Skeleton } from '@/ui/skeleton';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

function calculateProgress(tasks: Task[]): { completedValue: number } {
  let completedValue = 0;

  function recurse(taskArray: Task[]) {
    taskArray.forEach((task) => {
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

const processFirestoreTasks = (tasks: DocumentData[]): Task[] => {
  return tasks.map((task) => ({
    id: task.id || '',
    title: task.title || '',
    status: task.status || '待處理',
    lastUpdated:
      task.lastUpdated instanceof Timestamp
        ? task.lastUpdated.toDate().toISOString()
        : new Date().toISOString(),
    subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : [],
    value: task.value || 0,
    quantity: task.quantity || 0,
    unitPrice: task.unitPrice || 0,
  }));
};

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, 'projects'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: (data.startDate as Timestamp)?.toDate(),
            endDate: (data.endDate as Timestamp)?.toDate(),
            tasks: processFirestoreTasks(data.tasks || []),
          } as Project;
        });
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedProjectId(null);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
          <h2 className="text-xl font-semibold">尚無專案</h2>
          <p className="text-muted-foreground mt-2">點擊「新增專案」以開始。</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {projects.map((project) => {
            const { completedValue } = calculateProgress(project.tasks);
            const progressPercentage =
              project.value > 0 ? (completedValue / project.value) * 100 : 0;

            return (
              <Card
                key={project.id}
                className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewDetails(project.id)}
              >
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-muted-foreground">
                        進度
                      </span>
                      <span className="text-sm font-semibold">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      價值 ${completedValue.toLocaleString()} / $
                      {project.value.toLocaleString()} 已完成
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        開始日期：
                      </span>{' '}
                      {project.startDate
                        ? format(new Date(project.startDate), 'yyyy-MM-dd')
                        : '無'}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        結束日期：
                      </span>{' '}
                      {project.endDate
                        ? format(new Date(project.endDate), 'yyyy-MM-dd')
                        : '無'}
                    </p>
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
        <ProjectDetailsSheet
          project={selectedProject}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
        />
      )}
    </>
  );
}
