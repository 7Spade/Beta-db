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

interface ProjectsViewProps {
  initialProjects: Project[];
  initialAcceptances: AcceptanceRecord[];
}

type OptimisticAction =
  | { type: 'ADD'; payload: { parentId: string | null; newTask: Task } }
  | {
      type: 'UPDATE';
      payload: {
        taskId: string;
        updates: Partial<Pick<Task, 'title' | 'quantity' | 'unitPrice'>>;
      };
    }
  | { type: 'DELETE'; payload: { taskId: string } }
  | { type: 'STATUS'; payload: { taskId: string; isComplete: boolean } };

// Reducer for optimistic updates
const projectReducer = (
  state: Project[],
  action: OptimisticAction
): Project[] => {
  const findAndUpdate = (tasks: Task[]): Task[] => {
    return tasks
      .map((task) => {
        if (
          task.id === (action.payload as any).parentId &&
          action.type === 'ADD'
        ) {
          return {
            ...task,
            subTasks: [...task.subTasks, action.payload.newTask],
          };
        }
        if (task.id === (action.payload as any).taskId) {
          switch (action.type) {
            case 'UPDATE':
              return { ...task, ...action.payload.updates };
            case 'STATUS':
              return {
                ...task,
                completedQuantity: action.payload.isComplete
                  ? task.quantity
                  : 0,
              };
            case 'DELETE':
              return null; // Will be filtered out
          }
        }
        if (task.subTasks) {
          return { ...task, subTasks: findAndUpdate(task.subTasks) };
        }
        return task;
      })
      .filter((t): t is Task => t !== null);
  };

  return state.map((project) => {
    // This is a simplified logic, assuming actions happen on one project at a time.
    // A more robust solution might pass projectId in the action payload.
    return {
      ...project,
      tasks: findAndUpdate(project.tasks),
    };
  });
};

export function ProjectsView({
  initialProjects,
  initialAcceptances,
}: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);

  const [optimisticProjects, optimisticUpdate] = useOptimistic(
    initialProjects,
    projectReducer
  );

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
          optimisticUpdate={optimisticUpdate}
        />
      )}
    </div>
  );
}
