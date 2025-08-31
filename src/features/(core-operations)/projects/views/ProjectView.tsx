
/**
 * @fileoverview Projects View (Client Component)
 * @description This component is now a pure client component responsible for UI and interactions.
 * It receives its data as props from a Server Component parent.
 */
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { useState } from 'react';
import {
  addSubtaskAction,
  deleteSubtaskAction,
  updateTaskStatusAction,
} from '../actions/subtask.actions';
import { addTaskAction } from '../actions/task.actions';
import { AcceptanceList } from '../components/AcceptanceList';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { ProjectDetailsSheet } from '../components/ProjectDetailsSheet';
import { ProjectList } from '../components/ProjectList';
import type { AcceptanceRecord, Project } from '../types';

interface ProjectsViewProps {
  initialProjects: Project[];
  initialAcceptances: AcceptanceRecord[];
}

export function ProjectsView({
  initialProjects,
  initialAcceptances,
}: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTask = async (
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => {
    if (!selectedProjectId) return;

    const project = initialProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const result = await addTaskAction(
      selectedProjectId,
      project.tasks || [],
      taskTitle,
      quantity,
      unitPrice
    );

    if (result.success) {
      toast({ title: '成功', description: '任務已新增。' });
    } else {
      toast({
        title: '失敗',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleAddSubtask = async (
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => {
    if (!selectedProjectId) return;

    const project = initialProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const result = await addSubtaskAction(
      selectedProjectId,
      project.tasks || [],
      parentTaskId,
      taskTitle,
      quantity,
      unitPrice
    );

    if (result.success) {
      toast({ title: '成功', description: '子任務已新增。' });
    } else {
      toast({
        title: '失敗',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedProjectId) return;

    const project = initialProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const result = await deleteSubtaskAction(
      selectedProjectId,
      project.tasks || [],
      taskId
    );
    if (result.success) {
      toast({ title: '成功', description: '任務已刪除。' });
    } else {
      toast({
        title: '失敗',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string) => {
    if (!selectedProjectId) return;

    const project = initialProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const result = await updateTaskStatusAction(
      selectedProjectId,
      project.tasks || [],
      taskId
    );

    if (result.success) {
      toast({ title: '成功', description: '任務狀態已更新' });
    } else {
      toast({
        title: '失敗',
        description: result.error,
        variant: 'destructive',
      });
    }
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

  const selectedProject = initialProjects.find(
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
            projects={initialProjects}
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
          onAddSubtask={handleAddSubtask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      )}
    </div>
  );
}
