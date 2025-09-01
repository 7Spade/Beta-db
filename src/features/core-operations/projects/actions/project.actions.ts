'use server';

import type { Project } from '../types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
