'use client';

import type { Project } from '@/features/projects/types';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';
import { format } from 'date-fns';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex space-x-8 text-sm">
            <div>
              <span className="font-semibold">開始日期: </span>
              <span className="text-muted-foreground">
                {project.startDate
                  ? format(project.startDate, 'yyyy-MM-dd')
                  : '無'}
              </span>
            </div>
            <div>
              <span className="font-semibold">結束日期: </span>
              <span className="text-muted-foreground">
                {project.endDate ? format(project.endDate, 'yyyy-MM-dd') : '無'}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-base">
            總價值: ${project.value.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
