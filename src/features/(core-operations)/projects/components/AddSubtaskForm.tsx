'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { useToast } from '@root/src/lib/hooks/use-toast';
import React, { useState } from 'react';

interface AddSubtaskFormProps {
  parentTaskId: string;
  onAddSubtask: (
    parentTaskId: string,
    title: string,
    quantity: number,
    unitPrice: number
  ) => void;
  onCancel: () => void;
}

export function AddSubtaskForm({
  parentTaskId,
  onAddSubtask,
  onCancel,
}: AddSubtaskFormProps) {
  const { toast } = useToast();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskQuantity, setTaskQuantity] = useState(1);
  const [taskUnitPrice, setTaskUnitPrice] = useState(0);

  const taskValue = taskQuantity * taskUnitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      toast({
        title: '標題為必填項',
        description: '請為您的子任務輸入一個標題。',
        variant: 'destructive',
      });
      return;
    }
    onAddSubtask(parentTaskId, taskTitle.trim(), taskQuantity, taskUnitPrice);
    // Reset form and close it via the onCancel prop which should set the parent state
    setTaskTitle('');
    setTaskQuantity(1);
    setTaskUnitPrice(0);
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-2 rounded-lg border bg-secondary ml-14 mr-2"
    >
      <Input
        placeholder="輸入新子任務標題..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-grow"
        autoFocus
      />
      <Input
        type="number"
        placeholder="數量"
        value={taskQuantity || ''}
        onChange={(e) => setTaskQuantity(parseInt(e.target.value, 10) || 1)}
        className="w-20"
      />
      <Input
        type="number"
        placeholder="單價"
        value={taskUnitPrice || ''}
        onChange={(e) => setTaskUnitPrice(parseInt(e.target.value, 10) || 0)}
        className="w-24"
      />
      <Badge variant="secondary" className="w-24 justify-center">
        價值: ${taskValue.toLocaleString()}
      </Badge>
      <Button type="submit" className="bg-primary hover:bg-primary/90">
        新增
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        取消
      </Button>
    </form>
  );
}
