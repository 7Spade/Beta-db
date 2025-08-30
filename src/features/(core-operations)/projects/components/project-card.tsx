'use client';

import type {
  Project,
  Task,
} from '@/features/(core-operations)/projects/types';
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
import { format } from 'date-fns';

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

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { completedValue } = calculateProgress(project.tasks);
  const progressPercentage =
    project.value > 0 ? (completedValue / project.value) * 100 : 0;

  return (
    <Card
      key={project.id}
      className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onViewDetails(project.id)}
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
            <span className="font-medium text-foreground">開始日期：</span>{' '}
            {project.startDate
              ? format(new Date(project.startDate), 'yyyy-MM-dd')
              : '無'}
          </p>
          <p>
            <span className="font-medium text-foreground">結束日期：</span>{' '}
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
}
