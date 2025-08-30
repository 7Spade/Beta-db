'use client';

import { addTaskAction } from '@/features/(core-operations)/projects/actions/task-actions';
import type { Project } from '@/features/(core-operations)/projects/types';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useState, useTransition } from 'react';

interface AddTaskFormProps {
  project: Project;
}

export function AddTaskForm({ project }: AddTaskFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      startTransition(async () => {
        const result = await addTaskAction(
          project.id,
          null, // parentTaskId is null for root tasks
          taskTitle.trim()
        );
        if (result.success) {
          setTaskTitle('');
          toast({ title: '任務已新增' });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>專案任務</CardTitle>
        <CardDescription>為您的專案新增根層級的任務。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <Input
            placeholder="輸入新任務標題..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="flex-grow"
            disabled={isPending}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isPending ? '新增中...' : '新增任務'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
