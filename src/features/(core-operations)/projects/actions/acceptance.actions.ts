'use server';

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { AcceptanceRecord, Task } from '../types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';

interface CreateAcceptanceInput {
  title: string;
  projectId: string;
  projectName: string;
  applicantId: string;
  applicantName: string;
  reviewerId: string;
  taskId: string;
  submittedQuantity: number;
  notes?: string;
}

/**
 * Creates a new acceptance record in a 'draft' state.
 * This is a low-level DB operation.
 */
export async function createAcceptanceRecord(
  input: CreateAcceptanceInput
): Promise<{ success: boolean; error?: string; recordId?: string }> {
  try {
    const record: Omit<AcceptanceRecord, 'id'> = {
      ...input,
      status: '草稿',
      history: [
        { action: '建立', userId: input.applicantId, timestamp: new Date() },
      ],
      submittedAt: new Date(),
    };

    const docRef = await addDoc(collection(firestore, 'acceptance_records'), {
      ...record,
      submittedAt: serverTimestamp(),
    });

    revalidatePath('/projects');
    return { success: true, recordId: docRef.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: message };
  }
}

/**
 * Submits an existing draft acceptance record for review.
 */
export async function submitAcceptanceRecord(
  id: string,
  applicantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const recordRef = doc(firestore, 'acceptance_records', id);
    const recordSnap = await getDoc(recordRef);
    if (!recordSnap.exists()) throw new Error('找不到驗收單。');

    await updateDoc(recordRef, {
      status: '待審批',
      history: [
        ...(recordSnap.data()?.history || []),
        {
          action: '提交審批',
          userId: applicantId,
          timestamp: serverTimestamp(),
        },
      ],
    });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: message };
  }
}

/**
 * Approves an acceptance record and updates the corresponding task progress.
 * This is now the single source of truth for the approval database logic.
 */
export async function approveAcceptanceRecord(
  id: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const batch = writeBatch(firestore);
  const recordRef = doc(firestore, 'acceptance_records', id);

  try {
    const recordSnap = await getDoc(recordRef);
    if (!recordSnap.exists()) throw new Error('找不到指定的驗收單。');

    const acceptanceData = recordSnap.data() as AcceptanceRecord;
    const { taskId, projectId, submittedQuantity, status } = acceptanceData;

    if (status === '已批准') {
      // Prevent re-processing
      return { success: true };
    }

    if (!taskId || !projectId || typeof submittedQuantity !== 'number') {
      throw new Error('驗收單資料不完整，無法更新任務進度。');
    }

    // 1. Update the acceptance record
    batch.update(recordRef, {
      status: '已批准',
      reviewerId: adminId,
      reviewedAt: serverTimestamp(),
      history: [
        ...(acceptanceData.history || []),
        { action: '批准', userId: adminId, timestamp: serverTimestamp() },
      ],
    });

    // 2. Update the corresponding task's completedQuantity
    const projectRef = doc(firestore, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) throw new Error('找不到對應的專案。');

    const projectData = projectSnap.data();
    let taskUpdated = false;

    const updateRecursive = (tasks: Task[]): Task[] => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          taskUpdated = true;
          return {
            ...task,
            completedQuantity:
              (task.completedQuantity || 0) + submittedQuantity,
          };
        }
        if (task.subTasks && task.subTasks.length > 0) {
          return { ...task, subTasks: updateRecursive(task.subTasks) };
        }
        return task;
      });
    };

    const newTasks = updateRecursive(projectData?.tasks || []);

    if (!taskUpdated) {
      throw new Error('在專案中找不到對應的任務ID。');
    }

    batch.update(projectRef, { tasks: newTasks });

    await batch.commit();
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    console.error('Approve Acceptance Error:', message);
    return { success: false, error: message };
  }
}
