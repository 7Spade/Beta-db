/**
 * @fileoverview Projects Page (Server Component)
 * @description This page is now a Server Component responsible for fetching
 * initial project and acceptance data and passing it down to client components.
 */
import {
  ProjectsView
} from '@/features/core-operations/projects';
import type {
  AcceptanceRecord,
  Project,
  Task,
} from '@/features/core-operations/projects/types';
import { Skeleton } from '@/ui/skeleton';
import { adminDb } from '@root/src/features/integrations/database/firebase-admin/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Suspense } from 'react';

async function getProjectsAndAcceptances() {
  try {
    const projectsSnapshot = await adminDb.collection('projects').get();
    const projects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure tasks are properly mapped and timestamps converted
      const tasks = (data.tasks || []).map(
        (task: any): Task => ({
          ...task,
          lastUpdated: new Date(task.lastUpdated).toISOString(),
          subTasks: task.subTasks || [],
        })
      );

      return {
        id: doc.id,
        ...data,
        startDate: (data.startDate as Timestamp).toDate(),
        endDate: (data.endDate as Timestamp).toDate(),
        tasks: tasks,
      } as Project;
    });

    const acceptancesSnapshot = await adminDb
      .collection('acceptance_records')
      .get();
    const acceptances = acceptancesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: (data.submittedAt as Timestamp).toDate(),
        reviewedAt: data.reviewedAt
          ? (data.reviewedAt as Timestamp).toDate()
          : undefined,
        history: (data.history || []).map((h: any) => ({
          ...h,
          timestamp: h.timestamp
            ? (h.timestamp as Timestamp).toDate()
            : undefined,
        })),
      } as AcceptanceRecord;
    });

    return { projects, acceptances };
  } catch (error) {
    console.error('Failed to fetch server-side data for projects:', error);
    return { projects: [], acceptances: [] };
  }
}

function ProjectPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}

async function ProjectsPageContent() {
  const { projects, acceptances } = await getProjectsAndAcceptances();
  return (
    <ProjectsView initialProjects={projects} initialAcceptances={acceptances} />
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectPageSkeleton />}>
      <ProjectsPageContent />
    </Suspense>
  );
}
