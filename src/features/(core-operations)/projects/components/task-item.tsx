'use client';

import { AISubtaskSuggestions } from '@/features/(core-operations)/projects/components/ai-subtask-suggestions';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  project: Project;
}

// Function to calculate task status based on quantity
const getTaskStatus = (task: Task): '待處理' | '進行中' | '已完成' => {
  const completed = task.completedQuantity || 0;
  const total = task.quantity || 0;

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

export function TaskItem({ task, project }: TaskItemProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // Derive status from quantities
  const status = getTaskStatus(task);
  const isPending = false; // Placeholder for transition state if needed later

  const handleReportProgress = () => {
    // This will open a new dialog to submit progress
    // The logic will be handled by a new component, e.g., SubmitProgressDialog
    console.log(`Reporting progress for task: ${task.id}`);
  };

  const taskQuantity = task.quantity || 0;
  const taskUnitPrice = task.unitPrice || 0;
  const taskValue = task.value || 0;
  const completedQuantity = task.completedQuantity || 0;

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

          <Badge variant="outline" className="h-8">
            進度: {completedQuantity} / {taskQuantity}
          </Badge>

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

          <div className="flex items-center gap-2 w-[120px] justify-center h-8">
            {statusIcons[status]}
            <span className="text-sm">{status}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleReportProgress}
            disabled={completedQuantity >= taskQuantity}
          >
            回報進度
          </Button>

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
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>新增子任務</p>
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
          {/* Add subtask form logic will be refactored */}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
