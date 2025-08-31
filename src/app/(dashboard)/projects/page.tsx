/**
 * @fileoverview Projects Page (Server Component)
 * @description This page is now a Server Component responsible for fetching
 * initial project and acceptance data and passing it down to client components.
 */
import type {
  AcceptanceRecord,
  Project,
  Task,
} from '@/features/(core-operations)/projects/types';
import { adminDb } from '@/lib/db/firebase-admin/firebase-admin';
import { ProjectsView } from '@root/src/features/(core-operations)/projects/views/ProjectView';
import { Timestamp } from 'firebase-admin/firestore';

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

export default async function ProjectsPage() {
  const { projects, acceptances } = await getProjectsAndAcceptances();

  return (
    <ProjectsView initialProjects={projects} initialAcceptances={acceptances} />
  );
}
