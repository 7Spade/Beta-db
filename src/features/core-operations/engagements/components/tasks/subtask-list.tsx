'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/shared/hooks/use-toast';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteSubtaskAction, updateTaskStatusAction } from '../../actions/subtask.actions';
import type { Task } from '../../types';
import { AddSubtaskForm } from './add-subtask-form';

interface SubtaskListProps {
    engagementId: string;
    tasks: Task[];
    onTasksUpdate: () => void;
}

export function SubtaskList({ engagementId, tasks, onTasksUpdate }: SubtaskListProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const [showAddForm, setShowAddForm] = useState<string | null>(null);
    const { toast } = useToast();

    const toggleExpanded = (taskId: string) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const handleDeleteSubtask = async (taskId: string) => {
        try {
            const result = await deleteSubtaskAction(engagementId, tasks, taskId);
            if (result.success) {
                toast({
                    title: '成功',
                    description: '子任務已刪除。',
                });
                onTasksUpdate();
            } else {
                toast({
                    title: '錯誤',
                    description: result.error || '刪除子任務失敗。',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: '錯誤',
                description: '刪除子任務時發生錯誤。',
                variant: 'destructive',
            });
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            const result = await updateTaskStatusAction(engagementId, tasks, taskId);
            if (result.success) {
                toast({
                    title: '成功',
                    description: '任務狀態已更新。',
                });
                onTasksUpdate();
            } else {
                toast({
                    title: '錯誤',
                    description: result.error || '更新任務狀態失敗。',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: '錯誤',
                description: '更新任務狀態時發生錯誤。',
                variant: 'destructive',
            });
        }
    };

    const renderTask = (task: Task, level = 0) => {
        const hasSubtasks = task.subTasks && task.subTasks.length > 0;
        const isExpanded = expandedTasks.has(task.id);
        const isCompleted = task.status === '已完成';

        return (
            <div key={task.id} className="border-l-2 border-gray-200 pl-4" style={{ marginLeft: `${level * 16}px` }}>
                <Card className="mb-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {hasSubtasks && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpanded(task.id)}
                                    >
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                )}
                                <CardTitle className="text-sm">{task.title}</CardTitle>
                                <Badge variant={isCompleted ? 'default' : 'secondary'}>
                                    {task.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {task.completedQuantity}/{task.quantity}
                                </span>
                                <span className="text-sm font-medium">
                                    ${task.value.toFixed(2)}
                                </span>

                                {!isCompleted && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCompleteTask(task.id)}
                                    >
                                        完成
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAddForm(showAddForm === task.id ? null : task.id)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSubtask(task.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    {task.description && (
                        <CardContent className="pt-0">
                            <p className="text-sm text-gray-600">{task.description}</p>
                        </CardContent>
                    )}
                </Card>

                {showAddForm === task.id && (
                    <div className="mb-4">
                        <AddSubtaskForm
                            engagementId={engagementId}
                            parentTaskId={task.id}
                            tasks={tasks}
                            onSuccess={() => {
                                setShowAddForm(null);
                                onTasksUpdate();
                            }}
                        />
                    </div>
                )}

                {hasSubtasks && isExpanded && (
                    <div className="mt-2">
                        {task.subTasks!.map((subtask) => renderTask(subtask, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">任務層級結構</h3>
            {tasks.map((task) => renderTask(task))}
        </div>
    );
}
