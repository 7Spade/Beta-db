
'use client';

import type { Task } from '@/features/core-operations/projects/types';
import { Card, CardContent } from '@/ui/card';
import { ContractScopeItem } from './ContractScopeItem';

interface ContractScopeListProps {
  tasks: Task[];
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
}

export function ContractScopeList({
  tasks,
  expandedTasks,
  onToggleExpand,
}: ContractScopeListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">尚無工作項目</h3>
            <p className="text-sm text-muted-foreground">
              此合約沒有定義任何工作項目。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {tasks.map((task) => (
            <ContractScopeItem
              key={task.id}
              task={task}
              isExpanded={expandedTasks.has(task.id)}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
