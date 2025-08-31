'use client';

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
import type { Project } from '../types';
import { calculateProjectProgress } from '../utils';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { completedValue, totalValue } = calculateProjectProgress(
    project.tasks
  );
  // Ensure totalValue from calculation is used if project.value is 0 to avoid division by zero
  const safeTotalValue = project.value > 0 ? project.value : totalValue;
  const progressPercentage =
    safeTotalValue > 0 ? (completedValue / safeTotalValue) * 100 : 0;

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
