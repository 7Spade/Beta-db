
'use client';

import React from 'react';
import { useProjects } from '@/context/ProjectContext';
import { TaskItem } from '@/components/features/app/task-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Project, Task } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectDetailsSheetProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function calculateRemainingValue(totalValue: number, tasks: Task[]): number {
    const usedValue = tasks.reduce((acc, task) => acc + (task.value || 0), 0);
    return totalValue - usedValue;
}

export function ProjectDetailsSheet({ project, isOpen, onOpenChange }: ProjectDetailsSheetProps) {
  const { addTask } = useProjects();
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskQuantity, setTaskQuantity] = React.useState(1);
  const [taskUnitPrice, setTaskUnitPrice] = React.useState(0);

  const remainingValue = calculateRemainingValue(project.value, project.tasks);
  const taskValue = taskQuantity * taskUnitPrice;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(taskTitle.trim() && taskValue > 0) {
        if (taskValue > remainingValue) {
            alert(`任務價值 (${taskValue.toLocaleString()}) 不可超過剩餘的專案價值 ${remainingValue.toLocaleString()}`);
            return;
        }
        addTask(project.id, null, taskTitle.trim(), taskQuantity, taskUnitPrice);
        setTaskTitle('');
        setTaskQuantity(1);
        setTaskUnitPrice(0);
        setIsAddingTask(false);
    }
  }
  
  // When sheet is closed, reset the form
  React.useEffect(() => {
    if (!isOpen) {
        setIsAddingTask(false);
        setTaskTitle('');
        setTaskQuantity(1);
        setTaskUnitPrice(0);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader>
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            <SheetDescription>{project.description}</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-4">
             <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div className="flex space-x-8 text-sm">
                            <div>
                            <span className="font-semibold">開始日期: </span>
                            <span className="text-muted-foreground">{project.startDate ? format(project.startDate, 'yyyy-MM-dd') : '無'}</span>
                            </div>
                            <div>
                            <span className="font-semibold">結束日期: </span>
                            <span className="text-muted-foreground">{project.endDate ? format(project.endDate, 'yyyy-MM-dd') : '無'}</span>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-base">
                            總價值: ${project.value.toLocaleString()}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>任務</CardTitle>
                    <CardDescription>
                    可分配的剩餘價值：<span className="font-bold text-foreground">${remainingValue.toLocaleString()}</span>
                    </CardDescription>
                </div>
                {!isAddingTask && (
                    <Button variant="outline" onClick={() => setIsAddingTask(true)} disabled={remainingValue === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新增任務
                    </Button>
                )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {isAddingTask && (
                        <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-lg border bg-secondary">
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
                            <Button type="submit" className="bg-primary hover:bg-primary/90">新增任務</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsAddingTask(false)}>取消</Button>
                        </form>
                    )}

                    {project.tasks.length > 0 ? (
                        <div className="space-y-2">
                        {project.tasks.map((task) => (
                            <TaskItem key={task.id} task={task} projectId={project.id} />
                        ))}
                        </div>
                    ) : (
                        !isAddingTask && (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <h3 className="text-lg font-medium">尚無任務</h3>
                                <p className="text-sm text-muted-foreground">點擊「新增任務」以開始規劃。</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
