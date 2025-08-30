'use client';

import { CreateProjectDialog } from '@/features/(core-operations)/projects/components/create-project-dialog';
import { ProjectDetailsSheet } from '@/features/(core-operations)/projects/components/project-details-sheet';
import { ProjectList } from '@/features/(core-operations)/projects/components/project-list';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import type { AcceptanceRecord, Project, Task } from '@/lib/types/types';
import { Skeleton } from '@/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { AcceptanceList } from '../components/acceptance-list';

const processFirestoreTasks = (tasks: DocumentData[]): Task[] => {
  return tasks.map((task) => ({
    id: task.id || '',
    title: task.title || '',
    status: task.status || '待處理',
    lastUpdated:
      task.lastUpdated instanceof Timestamp
        ? task.lastUpdated.toDate().toISOString()
        : new Date().toISOString(),
    subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : [],
    value: task.value || 0,
    quantity: task.quantity || 0,
    unitPrice: task.unitPrice || 0,
  }));
};

const processFirestoreAcceptances = (
  docs: DocumentData[]
): AcceptanceRecord[] => {
  return docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      submittedAt: (data.submittedAt as Timestamp)?.toDate(),
      reviewedAt: (data.reviewedAt as Timestamp)?.toDate(),
      history: (data.history || []).map((h: any) => ({
        ...h,
        timestamp: (h.timestamp as Timestamp)?.toDate(),
      })),
    } as AcceptanceRecord;
  });
};

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [acceptances, setAcceptances] = useState<AcceptanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const qProjects = query(collection(firestore, 'projects'));
    const qAcceptances = query(collection(firestore, 'acceptance_records'));

    const unsubProjects = onSnapshot(
      qProjects,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: (data.startDate as Timestamp)?.toDate(),
            endDate: (data.endDate as Timestamp)?.toDate(),
            tasks: processFirestoreTasks(data.tasks || []),
          } as Project;
        });
        setProjects(projectsData);
        if (loading) setLoading(false); // Only set loading false once
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    );

    const unsubAcceptances = onSnapshot(
      qAcceptances,
      (snapshot) => {
        const acceptancesData = processFirestoreAcceptances(snapshot.docs);
        setAcceptances(acceptancesData);
      },
      (error) => {
        console.error('Error fetching acceptances:', error);
      }
    );

    return () => {
      unsubProjects();
      unsubAcceptances();
    };
  }, [loading]);

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

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const LoadingView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
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
        {loading ? (
          <LoadingView />
        ) : (
          <ProjectList projects={projects} onViewDetails={handleViewDetails} />
        )}
      </TabsContent>
      <TabsContent value="acceptances">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <AcceptanceList acceptances={acceptances} />
        )}
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
