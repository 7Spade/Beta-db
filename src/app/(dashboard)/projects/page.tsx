import { ProjectsView } from '@/features/projects/views/projects-view';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import type { Project, Task } from '@/features/projects/types';
import {
  collection,
  DocumentData,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

async function getProjects(): Promise<Project[]> {
  const projectsCollection = collection(firestore, 'projects');
  const projectSnapshot = await getDocs(projectsCollection);

  const processFirestoreTasks = (tasks: DocumentData[]): Task[] => {
    return tasks.map((task) => ({
      id: task.id || '',
      title: task.title || '',
      status: task.status || '待處理',
      lastUpdated: task.lastUpdated
        ? task.lastUpdated instanceof Timestamp
          ? task.lastUpdated.toDate().toISOString()
          : task.lastUpdated
        : new Date().toISOString(),
      subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : [],
      value: task.value || 0,
      quantity: task.quantity || 0,
      unitPrice: task.unitPrice || 0,
    }));
  };

  const projectsData = projectSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      startDate: (data.startDate as Timestamp)?.toDate(),
      endDate: (data.endDate as Timestamp)?.toDate(),
      tasks: processFirestoreTasks(data.tasks || []),
    } as Project;
  });

  return projectsData;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView initialProjects={projects} />;
}
