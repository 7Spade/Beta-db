'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import type { Project, Task } from '../types';

function calculateRemainingValue(totalValue: number, tasks: Task[]): number {
  const usedValue = tasks.reduce((acc, task) => acc + (task.value || 0), 0);
  return totalValue - usedValue;
}

interface AddTaskPanelProps {
  project: Omit<Project, 'startDate' | 'endDate'> & {
    startDate: Date;
    endDate: Date;
  };
  onAddTask: (taskTitle: string, quantity: number, unitPrice: number) => void;
}

export function AddTaskPanel({ project, onAddTask }: AddTaskPanelProps) {
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskQuantity, setTaskQuantity] = useState(1);
  const [taskUnitPrice, setTaskUnitPrice] = useState(0);

  const remainingValue = calculateRemainingValue(project.value, project.tasks);
  const taskValue = taskQuantity * taskUnitPrice;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() && taskValue > 0) {
      if (taskValue > remainingValue) {
        toast({
          title: '任務價值超過剩餘價值',
          description: `任務價值 (${taskValue.toLocaleString()}) 不可超過剩餘的專案價值 ${remainingValue.toLocaleString()}`,
          variant: 'destructive',
        });
        return;
      }
      onAddTask(taskTitle, taskQuantity, taskUnitPrice);
      setTaskTitle('');
      setTaskQuantity(1);
      setTaskUnitPrice(0);
      setIsAddingTask(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>任務</CardTitle>
          <CardDescription>
            可分配的剩餘價值：
            <span className="font-bold text-foreground">
              ${remainingValue.toLocaleString()}
            </span>
          </CardDescription>
        </div>
        {!isAddingTask && (
          <Button
            variant="outline"
            onClick={() => setIsAddingTask(true)}
            disabled={remainingValue === 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            新增任務
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingTask && (
          <form
            onSubmit={handleAddTask}
            className="flex items-center gap-2 p-2 rounded-lg border bg-secondary"
          >
            <Input
              placeholder="輸入新任務標題..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-grow"
              autoFocus
            />
            <Input
              type="number"
              placeholder="數量"
              value={taskQuantity || ''}
              onChange={(e) =>
                setTaskQuantity(parseInt(e.target.value, 10) || 1)
              }
              className="w-20"
            />
            <Input
              type="number"
              placeholder="單價"
              value={taskUnitPrice || ''}
              onChange={(e) =>
                setTaskUnitPrice(parseInt(e.target.value, 10) || 0)
              }
              className="w-24"
            />
            <Badge variant="secondary" className="w-24 justify-center">
              價值: ${taskValue.toLocaleString()}
            </Badge>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              新增任務
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddingTask(false)}
            >
              取消
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
