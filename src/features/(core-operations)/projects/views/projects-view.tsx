/**
 * @fileoverview Projects View (Client Component)
 * @description This component is now a pure client component responsible for UI and interactions.
 * It receives its data as props from a Server Component parent.
 */
'use client';

import { useState } from 'react';
import type { AcceptanceRecord, Project } from '@/lib/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { CreateProjectDialog } from '../components/create-project-dialog';
import { ProjectList } from '../components/project-list';
import { AcceptanceList } from '../components/acceptance-list';
import { ProjectDetailsSheet } from '../components/project-details-sheet';

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
    <Tabs defaultValue="projects" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="projects">專案列表</TabsTrigger>
          <TabsTrigger value="acceptances">驗收管理</TabsTrigger>
        </TabsList>
        <CreateProjectDialog />
      </div>

      <TabsContent value="projects">
        <ProjectList
          projects={initialProjects}
          onViewDetails={handleViewDetails}
        />
      </TabsContent>
      <TabsContent value="acceptances">
        <AcceptanceList acceptances={initialAcceptances} />
      </TabsContent>

      {selectedProjectId && (
        <ProjectDetailsSheet
          project={selectedProject}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
        />
      )}
    </Tabs>
  );
}
