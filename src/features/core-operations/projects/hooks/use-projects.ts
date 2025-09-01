/**
 * @fileoverview 專案數據管理 Hook
 */

import type { Project } from '@/features/core-operations/projects/types';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import {
  collection,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  query,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Helper function to recursively convert Timestamps to Dates in tasks
const processTasks = (tasks: any[]): any[] => {
  return tasks.map((task) => {
    const processedTask = { ...task };
    if (task.lastUpdated && typeof task.lastUpdated === 'string') {
      // It's already an ISO string, no need to convert
    } else if (task.lastUpdated instanceof Timestamp) {
      processedTask.lastUpdated = task.lastUpdated.toDate().toISOString();
    }

    if (task.subTasks && Array.isArray(task.subTasks)) {
      processedTask.subTasks = processTasks(task.subTasks);
    } else {
      processedTask.subTasks = [];
    }
    return processedTask;
  });
};

// Helper function to convert Firestore Timestamps to Dates for a Project
const processFirestoreProject = (
  doc: DocumentSnapshot<DocumentData>
): Project => {
  const data = doc.data();
  if (!data) {
    throw new Error('Document data is undefined');
  }

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    value: data.value || 0,
    startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
    endDate: (data.endDate as Timestamp)?.toDate() || new Date(),
    tasks: data.tasks ? processTasks(data.tasks) : [],
  } as Project;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const projectsCollection = collection(firestore, 'projects');
    const q = query(projectsCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const projectList = querySnapshot.docs.map(processFirestoreProject);
          setProjects(projectList);
          setError(null);
        } catch (err) {
          console.error('處理專案數據時發生錯誤：', err);
          setError('處理專案數據時發生錯誤');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('獲取專案時發生錯誤：', error);
        setError('獲取專案時發生錯誤');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    projects,
    loading,
    error,
  };
}
