'use server';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Project } from '@/features/projects/types';

export async function addProjectAction(
  project: Omit<Project, 'id' | 'tasks'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const projectDataForFirestore = {
      ...project,
      startDate: Timestamp.fromDate(project.startDate as Date),
      endDate: Timestamp.fromDate(project.endDate as Date),
      tasks: [],
    };
    await addDoc(collection(firestore, 'projects'), projectDataForFirestore);
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `新增專案失敗: ${errorMessage}` };
  }
}
