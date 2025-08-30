/**
 * @fileoverview Projects View (Client Component)
 * @description This component is now a pure client component responsible for UI and interactions.
 * It receives its data as props from a Server Component parent.
 */
'use client';

import { useOptimistic, useState } from 'react';
import type { AcceptanceRecord, Project, Task } from '@/lib/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { CreateProjectDialog } from '../components/create-project-dialog';
import { ProjectList } from '../components/project-list';
import { AcceptanceList } from '../components/acceptance-list';
import { ProjectDetailsSheet } from '../components/project-details-sheet';
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
} from '../actions/task-actions';
import { useToast } from '@root/src/lib/hooks/use-toast';

interface ProjectsViewProps {
  initialProjects: Project[];
  initialAcceptances: AcceptanceRecord[];
}

type OptimisticAction =
  | {
      type: 'ADD';
      payload: { projectId: string; parentId: string | null; newTask: Task };
    }
  | {
      type: 'UPDATE';
      payload: { projectId: string; taskId: string; updates: Partial<Task> };
    }
  | { type: 'DELETE'; payload: { projectId: string; taskId: string } }
  | {
      type: 'STATUS';
      payload: { projectId: string; taskId: string; isComplete: boolean };
    };

const projectReducer = (
  state: Project[],
  action: OptimisticAction
): Project[] => {
  const { type, payload } = action;

  // Helper function to recursively find and update/delete tasks
  const updateTasksRecursive = (tasks: Task[]): Task[] => {
    return tasks
      .map((task) => {
        if (task.id === (payload as any).parentId && type === 'ADD') {
          return {
            ...task,
            subTasks: [...(task.subTasks || []), (payload as any).newTask],
          };
        }
        if (task.id === (payload as any).taskId) {
          switch (type) {
            case 'UPDATE':
              return { ...task, ...(payload as any).updates };
            case 'STATUS':
              return {
                ...task,
                completedQuantity: (payload as any).isComplete
                  ? task.quantity
                  : 0,
              };
            case 'DELETE':
              return null; // Mark for deletion
          }
        }
        if (task.subTasks && task.subTasks.length > 0) {
          return { ...task, subTasks: updateTasksRecursive(task.subTasks) };
        }
        return task;
      })
      .filter((t): t is Task => t !== null);
  };

  if (type === 'ADD' && !payload.parentId) {
    return state.map((project) =>
      project.id === payload.projectId
        ? { ...project, tasks: [...project.tasks, payload.newTask] }
        : project
    );
  }

  return state.map((project) =>
    project.id === payload.projectId
      ? { ...project, tasks: updateTasksRecursive(project.tasks) }
      : project
  );
};

export function ProjectsView({
  initialProjects,
  initialAcceptances,
}: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const [optimisticProjects, optimisticUpdate] = useOptimistic(
    initialProjects,
    projectReducer
  );

  const handleAction = async (
    actionFn: () => Promise<{ success: boolean; error?: string }>,
    optimisticAction: OptimisticAction
  ) => {
    optimisticUpdate(optimisticAction);
    const result = await actionFn();
    if (result.error) {
      toast({
        title: '操作失敗',
        description: result.error,
        variant: 'destructive',
      });
      // Note: React will automatically revert the optimistic state on error if the component re-renders.
      // A manual revert might be needed if re-render doesn't happen, but revalidatePath should handle it.
    }
  };

  const handleAddTask = (
    projectId: string,
    parentId: string | null,
    title: string
  ) => {
    const newTask: Task = {
      id: `optimistic-${Date.now()}`,
      title: title,
      lastUpdated: new Date().toISOString(),
      subTasks: [],
      quantity: 1,
      unitPrice: 0,
      value: 0,
      completedQuantity: 0,
    };
    handleAction(() => addTaskAction(projectId, parentId, title), {
      type: 'ADD',
      payload: { projectId, parentId, newTask },
    });
  };

  const handleUpdateTask = (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    handleAction(() => updateTaskAction(projectId, taskId, updates), {
      type: 'UPDATE',
      payload: { projectId, taskId, updates },
    });
  };

  const handleDeleteTask = (projectId: string, taskId: string) => {
    handleAction(() => deleteTaskAction(projectId, taskId), {
      type: 'DELETE',
      payload: { projectId, taskId },
    });
  };

  const handleUpdateTaskStatus = (
    projectId: string,
    taskId: string,
    isComplete: boolean
  ) => {
    handleAction(() => updateTaskStatusAction(projectId, taskId, isComplete), {
      type: 'STATUS',
      payload: { projectId, taskId, isComplete },
    });
  };

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedProjectId(null);
    }
  };

  const selectedProject = optimisticProjects.find(
    (p) => p.id === selectedProjectId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">專案管理</h1>
        <CreateProjectDialog />
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">專案列表</TabsTrigger>
          <TabsTrigger value="acceptances">驗收管理</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectList
            projects={optimisticProjects}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
        <TabsContent value="acceptances">
          <AcceptanceList acceptances={initialAcceptances} />
        </TabsContent>
      </Tabs>

      {selectedProjectId && (
        <ProjectDetailsSheet
          project={selectedProject}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      )}
    </div>
  );
}
