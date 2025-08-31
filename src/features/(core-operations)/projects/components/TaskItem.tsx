
'use client';

import { Badge } from '@/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import { Progress } from '@/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { cn } from '@/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, ChevronRight, Circle, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Project, Task } from '../types';
import { AddSubtaskForm } from './AddSubtaskForm';
import { AiSubtaskSuggestions } from './AiSubtaskSuggestions';
import { SubmitProgressDialog } from './SubmitProgressDialog';
import { TaskActions } from './TaskActions';

interface TaskItemProps {
  task: Task;
  project: Project;
  onAddSubtask: (
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string) => void;
}

const getTaskStatus = (task: Task): '待處理' | '進行中' | '已完成' => {
  const completed = task.completedQuantity || 0;
  const total = task.quantity || 0;

  if (total === 0 && completed === 0) {
    return '待處理';
  }
  if (completed >= total) {
    return '已完成';
  }
  if (completed > 0) {
    return '進行中';
  }
  return '待處理';
};

const statusIcons: Record<ReturnType<typeof getTaskStatus>, React.ReactNode> = {
  待處理: <Circle className="h-4 w-4 text-muted-foreground" />,
  進行中: <Clock className="h-4 w-4 text-yellow-500" />,
  已完成: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const statusColors: Record<ReturnType<typeof getTaskStatus>, string> = {
  待處理: 'border-muted-foreground/30',
  進行中: 'border-yellow-500/30',
  已完成: 'border-green-500/30',
};

export function TaskItem({
  task,
  project,
  onAddSubtask,
  onDeleteTask,
  onUpdateTaskStatus,
}: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);

  const status = getTaskStatus(task);
  const isPending = false; // Placeholder for transition state

  const taskQuantity = task.quantity || 0;
  const taskValue = task.value || 0;
  const completedQuantity = task.completedQuantity || 0;
  const remainingQuantity = taskQuantity - completedQuantity;
  const progressPercentage =
    taskQuantity > 0 ? (completedQuantity / taskQuantity) * 100 : 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border p-2 pl-3 bg-card',
            statusColors[status],
            isPending && 'opacity-50'
          )}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'p-1 rounded-md hover:bg-muted',
                task.subTasks.length === 0 && 'invisible'
              )}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </button>
          </CollapsibleTrigger>

          <div className="flex items-center gap-2 w-28 justify-start">
            {statusIcons[status]}
            <span className="text-sm font-medium">{status}</span>
          </div>

          <span
            className="flex-grow font-medium cursor-pointer"
            onClick={() => setIsProgressDialogOpen(true)}
          >
            {task.title}
          </span>

          <div className="w-32 space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-muted-foreground">
                進度: {completedQuantity} / {taskQuantity}
              </span>
              <span className="text-sm font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Badge variant="secondary" className="h-8">
            ${taskValue.toLocaleString()}
          </Badge>

          <Tooltip>
            <TooltipTrigger>
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

          <TaskActions
            onShowAISuggestions={() => setShowAISuggestions(true)}
            onStartAddTask={() => setIsAddingSubtask(true)}
            onDeleteTask={() => onDeleteTask(task.id)}
          />
        </div>

        {isAddingSubtask && (
          <AddSubtaskForm
            parentTaskId={task.id}
            onAddSubtask={onAddSubtask}
            onCancel={() => setIsAddingSubtask(false)}
          />
        )}

        {showAISuggestions && project && (
          <AiSubtaskSuggestions
            project={project}
            taskTitle={task.title}
            parentTaskId={task.id}
            onAddSubtask={onAddSubtask}
            onClose={() => setShowAISuggestions(false)}
          />
        )}

        <CollapsibleContent className="pl-6 space-y-2">
          {task.subTasks.map((subTask) => (
            <TaskItem
              key={subTask.id}
              task={subTask}
              project={project}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <SubmitProgressDialog
        isOpen={isProgressDialogOpen}
        onOpenChange={setIsProgressDialogOpen}
        task={task}
        project={project}
        remainingQuantity={remainingQuantity}
      />
    </TooltipProvider>
  );
}
