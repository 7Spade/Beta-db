'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
} from 'firebase/firestore';
import type { Project, Task } from '@/features/projects/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { ProjectDetailsSheet } from '@/features/projects/components/project-details-sheet';
import { ProjectList } from '@/features/projects/components/project-list';
import { Skeleton } from '@/ui/skeleton';

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

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, 'projects'));
    const unsubscribe = onSnapshot(
      q,
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
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <CreateProjectDialog />
      </div>
      <ProjectList projects={projects} onViewDetails={handleViewDetails} />
      {selectedProjectId && (
        <ProjectDetailsSheet
          project={selectedProject}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
        />
      )}
    </>
  );
}
