'use client';

import type { Project } from '@/features/(core-operations)/projects/types';
import { Card, CardContent } from '@/ui/card';
import { TaskItem } from './task-item';

interface TaskListProps {
  project: Project;
  optimisticUpdate: (action: any) => void;
}

export function TaskList({ project, optimisticUpdate }: TaskListProps) {
  if (!project.tasks || project.tasks.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">尚無任務</h3>
            <p className="text-sm text-muted-foreground">
              點擊「新增任務」以開始規劃。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-1">
          {project.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={project}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
