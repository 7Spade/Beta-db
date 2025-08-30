'use client';

import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
} from '@/features/(core-operations)/projects/actions/task-actions';
import type {
  Project,
  Task,
} from '@/features/(core-operations)/projects/types';
import { cn } from '@/lib/utils/utils';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import { Input } from '@/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Edit,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState, useTransition } from 'react';

type TaskStatus = '待處理' | '進行中' | '已完成';

// Function to calculate task status based on quantity
const getTaskStatus = (task: Task): TaskStatus => {
  const completed = task.completedQuantity || 0;
  const total = task.quantity || 0;

  if (total > 0 && completed >= total) {
    return '已完成';
  }
  if (completed > 0) {
    return '進行中';
  }
  return '待處理';
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  待處理: <Circle className="h-4 w-4 text-muted-foreground" />,
  進行中: <Clock className="h-4 w-4 text-yellow-500" />,
  已完成: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

interface TaskItemProps {
  task: Task;
  project: Project;
  optimisticUpdate: (action: {
    type: 'ADD' | 'UPDATE' | 'DELETE' | 'STATUS';
    payload: any;
  }) => void;
}

export function TaskItem({ task, project, optimisticUpdate }: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const status = getTaskStatus(task);
  const isComplete = status === '已完成';

  const handleAction = (
    actionFn: () => Promise<{ success: boolean; error?: string }>,
    successMessage: string,
    errorMessage: string
  ) => {
    startTransition(async () => {
      const result = await actionFn();
      if (result.error) {
        toast({
          title: '錯誤',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({ title: successMessage });
      }
    });
  };

  const handleSave = () => {
    optimisticUpdate({
      type: 'UPDATE',
      payload: { taskId: task.id, updates: { title: editedTitle } },
    });
    setIsEditing(false);
    handleAction(
      () => updateTaskAction(project.id, task.id, { title: editedTitle }),
      '任務已更新',
      '更新任務失敗'
    );
  };

  const handleToggleStatus = () => {
    const newIsComplete = !isComplete;
    optimisticUpdate({
      type: 'STATUS',
      payload: { taskId: task.id, isComplete: newIsComplete },
    });
    handleAction(
      () => updateTaskStatusAction(project.id, task.id, newIsComplete),
      '任務狀態已更新',
      '更新任務狀態失敗'
    );
  };

  const handleDelete = () => {
    optimisticUpdate({ type: 'DELETE', payload: { taskId: task.id } });
    handleAction(
      () => deleteTaskAction(project.id, task.id),
      '任務已刪除',
      '刪除任務失敗'
    );
  };

  const handleAddSubtask = () => {
    const subtaskTitle = `子任務 for ${task.title}`;
    // The optimistic update will be handled by the parent
    // The server action will return the new task object
    startTransition(async () => {
      const result = await addTaskAction(project.id, task.id, subtaskTitle);
      if (result.success && result.newTask) {
        optimisticUpdate({
          type: 'ADD',
          payload: { parentId: task.id, newTask: result.newTask },
        });
        toast({ title: '子任務已新增' });
      } else if (result.error) {
        toast({
          title: '錯誤',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border p-2 pl-3 bg-card transition-opacity',
            isPending && 'opacity-50'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleToggleStatus}
            disabled={isPending}
          >
            {statusIcons[status]}
          </Button>

          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow h-8"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <span className="flex-grow font-medium">{task.title}</span>
          )}

          <Badge variant="outline">${task.value.toLocaleString()}</Badge>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground mr-2">
                {formatDistanceToNow(new Date(task.lastUpdated), {
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>上次更新：{new Date(task.lastUpdated).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>

          {isEditing ? (
            <Button
              size="icon"
              className="h-8 w-8"
              onClick={handleSave}
              disabled={isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddSubtask}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                task.subTasks.length === 0 && 'invisible'
              )}
              disabled={isPending}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pl-6 space-y-1">
          {task.subTasks.map((subTask) => (
            <TaskItem
              key={subTask.id}
              task={subTask}
              project={project}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
