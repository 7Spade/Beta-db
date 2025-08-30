'use client';

import {
  addTaskAction,
  updateTaskStatusAction,
} from '@/features/(core-operations)/projects/actions/task-actions';
import { AISubtaskSuggestions } from '@/features/(core-operations)/projects/components/ai-subtask-suggestions';
import type {
  Project,
  Task,
  TaskStatus,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
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
  Plus,
  Sparkles,
} from 'lucide-react';
import { useState, useTransition } from 'react';

interface TaskItemProps {
  task: Task;
  project: Project;
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  待處理: <Circle className="h-4 w-4 text-muted-foreground" />,
  進行中: <Clock className="h-4 w-4 text-yellow-500" />,
  已完成: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const statusColors: Record<TaskStatus, string> = {
  待處理: 'border-muted-foreground/30',
  進行中: 'border-yellow-500/30',
  已完成: 'border-green-500/30',
};

function calculateRemainingValue(totalValue: number, tasks: Task[]): number {
  const usedValue = tasks.reduce((acc, task) => acc + (task.value || 0), 0);
  return totalValue - usedValue;
}

export function TaskItem({ task, project }: TaskItemProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskQuantity, setSubtaskQuantity] = useState(1);
  const [subtaskUnitPrice, setSubtaskUnitPrice] = useState(0);

  const [isOpen, setIsOpen] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const remainingValue = calculateRemainingValue(task.value, task.subTasks);
  const subtaskValue = subtaskQuantity * subtaskUnitPrice;

  const handleStatusChange = (status: TaskStatus) => {
    startTransition(async () => {
      await updateTaskStatusAction(project.id, project.tasks, task.id, status);
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim() && subtaskValue > 0) {
      if (subtaskValue > remainingValue) {
        toast({
          title: '子任務價值超過剩餘價值',
          description: `子任務價值 (${subtaskValue.toLocaleString()}) 不可超過剩餘的任務價值 ${remainingValue.toLocaleString()}`,
          variant: 'destructive',
        });
        return;
      }
      startTransition(async () => {
        const result = await addTaskAction(
          project.id,
          project.tasks,
          task.id,
          subtaskTitle.trim(),
          subtaskQuantity,
          subtaskUnitPrice
        );
        if (result.success) {
          setSubtaskTitle('');
          setSubtaskQuantity(1);
          setSubtaskUnitPrice(0);
          setIsAddingSubtask(false);
          setIsOpen(true);
        } else {
          toast({
            title: '新增失敗',
            description: result.error,
            variant: 'destructive',
          });
        }
      });
    }
  };

  const handleAddSuggestedSubtask = (title: string) => {
    startTransition(async () => {
      await addTaskAction(project.id, project.tasks, task.id, title, 1, 0);
    });
    toast({
      title: '子任務已新增',
      description: `"${title}" 已被加到您的任務清單中。`,
    });
  };

  const taskQuantity = task.quantity || 0;
  const taskUnitPrice = task.unitPrice || 0;
  const taskValue = task.value || 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border p-2 pl-3 bg-card',
            statusColors[task.status],
            isPending && 'opacity-50'
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6',
                task.subTasks.length === 0 && 'invisible'
              )}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <span className="flex-grow font-medium">{task.title}</span>
          <Badge variant="secondary">
            ${taskValue.toLocaleString()} (${taskQuantity} x $
            {taskUnitPrice.toLocaleString()})
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
          <Select
            value={task.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="設定狀態" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(statusIcons).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    {statusIcons[status as TaskStatus]}
                    <span>{status}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowAISuggestions(true)}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>取得 AI 子任務建議</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAddingSubtask(true)}
                disabled={remainingValue === 0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {remainingValue > 0 ? (
                <p>新增子任務 (剩餘: ${remainingValue.toLocaleString()})</p>
              ) : (
                <p>沒有剩餘價值可分配</p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>

        {showAISuggestions && project && (
          <AISubtaskSuggestions
            project={project}
            taskTitle={task.title}
            parentTaskId={task.id}
            onClose={() => setShowAISuggestions(false)}
          />
        )}

        <CollapsibleContent className="pl-6 space-y-2">
          {task.subTasks.map((subTask) => (
            <TaskItem key={subTask.id} task={subTask} project={project} />
          ))}

          {isAddingSubtask && (
            <form
              onSubmit={handleAddSubtask}
              className="flex items-center gap-2 pl-8 pr-2 py-2 rounded-lg border bg-secondary"
            >
              <Input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="新子任務標題"
                className="h-8 flex-grow"
                autoFocus
              />
              <Input
                type="number"
                placeholder="數量"
                value={subtaskQuantity || ''}
                onChange={(e) =>
                  setSubtaskQuantity(parseInt(e.target.value, 10) || 1)
                }
                className="h-8 w-20"
              />
              <Input
                type="number"
                placeholder="單價"
                value={subtaskUnitPrice || ''}
                onChange={(e) =>
                  setSubtaskUnitPrice(parseInt(e.target.value, 10) || 0)
                }
                className="h-8 w-24"
              />
              <Badge
                variant="outline"
                className="h-8 w-28 justify-center bg-background"
              >
                價值: ${subtaskValue.toLocaleString()}
              </Badge>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 h-8"
                disabled={isPending}
              >
                新增
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSubtask(false)}
                className="h-8"
              >
                取消
              </Button>
            </form>
          )}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
