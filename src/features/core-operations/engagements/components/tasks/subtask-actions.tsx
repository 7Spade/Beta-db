'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../../types';
import { AddSubtaskForm } from './add-subtask-form';

interface SubtaskActionsProps {
    engagementId: string;
    parentTaskId: string;
    tasks: Task[];
    onSuccess?: () => void;
}

export function SubtaskActions({
    engagementId,
    parentTaskId,
    tasks,
    onSuccess,
}: SubtaskActionsProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                <Plus className="h-4 w-4 mr-2" />
                手動新增子任務
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
            >
                <Sparkles className="h-4 w-4 mr-2" />
                AI 建議子任務
            </Button>

            {showAddForm && (
                <div className="mt-4">
                    <AddSubtaskForm
                        engagementId={engagementId}
                        parentTaskId={parentTaskId}
                        tasks={tasks}
                        onSuccess={() => {
                            setShowAddForm(false);
                            onSuccess?.();
                        }}
                    />
                </div>
            )}

            {showAiSuggestions && (
                <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-600">
                        AI 子任務建議功能將在後續版本中實現。
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAiSuggestions(false)}
                        className="mt-2"
                    >
                        關閉
                    </Button>
                </div>
            )}
        </div>
    );
}
