
import { ProjectsView } from '@/components/features/app/views/projects-view';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import type { Project, Task } from '@/lib/types/types';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

async function getProjects(): Promise<Project[]> {
    const projectsCollection = collection(firestore, 'projects');
    const projectSnapshot = await getDocs(projectsCollection);
    
    const processFirestoreTasks = (tasks: any[]): Task[] => {
      return tasks.map(task => ({
          ...task,
          lastUpdated: task.lastUpdated, // Should already be ISO string
          subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : []
      }));
    }

    const projectsData = projectSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startDate: (data.startDate as Timestamp)?.toDate(),
        endDate: (data.endDate as Timestamp)?.toDate(),
        tasks: processFirestoreTasks(data.tasks || [])
      } as Project;
    });

    return projectsData;
}


export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView initialProjects={projects} />;
}
