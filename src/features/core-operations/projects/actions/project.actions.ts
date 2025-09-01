'use server';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Project } from '../types';

export async function addProjectAction(
  project: Omit<Project, 'id' | 'tasks'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const projectDataForFirestore = {
      ...project,
      startDate: Timestamp.fromDate(new Date(project.startDate)),
      endDate: Timestamp.fromDate(new Date(project.endDate)),
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
