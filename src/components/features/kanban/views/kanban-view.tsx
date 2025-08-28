
'use client';

import { useState } from 'react';
import { KanbanBoard } from "../components/kanban-board";
import { columns as initialColumns, tasks as initialTasks } from "../data";
import type { Column, Task } from '../types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const KanbanView = () => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newColumnName, setNewColumnName] = useState('');

    const addTask = (columnId: string, title: string) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            status: columnId,
            title,
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const addColumn = () => {
        if (!newColumnName.trim()) return;
        const newColumn: Column = {
            id: `col-${Date.now()}`,
            title: newColumnName.trim(),
        };
        setColumns([...columns, newColumn]);
        setNewColumnName('');
    };

    const deleteColumn = (columnId: string) => {
        // First delete all tasks in that column
        setTasks(tasks.filter(task => task.status !== columnId));
        // Then delete the column
        setColumns(columns.filter(col => col.id !== columnId));
    };

    return (
        <div className="flex flex-col h-full space-y-4">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">記事看板</h1>
                <p className="text-muted-foreground">透過拖放來組織您的任務與想法。</p>
            </div>
            <div className="flex-grow overflow-x-auto">
                <div className="flex gap-4 items-start pb-4">
                    <KanbanBoard 
                        columns={columns} 
                        tasks={tasks} 
                        setColumns={setColumns}
                        setTasks={setTasks}
                        onAddTask={addTask}
                        onDeleteTask={deleteTask}
                        onDeleteColumn={deleteColumn}
                    />
                    <div className="w-full max-w-sm flex-shrink-0 space-y-2">
                        <Input
                            type="text"
                            placeholder="新欄位名稱..."
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
                        />
                        <Button onClick={addColumn} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            新增欄位
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
