
'use client';

import type { Project, Task } from '../types';
import { Card, CardContent } from '@/ui/card';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  project: Project;
  onAddSubtask: (
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string) => void;
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
}

export function TaskList({
  project,
  onAddSubtask,
  onDeleteTask,
  onUpdateTaskStatus,
  expandedTasks,
  onToggleExpand,
}: TaskListProps) {
  if (project.tasks.length === 0) {
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
        <div className="space-y-2">
          {project.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={project}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              expandedTasks={expandedTasks}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
