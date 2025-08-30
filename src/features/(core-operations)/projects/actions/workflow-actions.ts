'use server';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Task } from '@/lib/types/types';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface SubmitProgressInput {
  projectId: string;
  taskId: string;
  taskTitle: string;
  submittedQuantity: number;
  notes?: string;
  applicantId: string;
  applicantName: string;
  reviewerId: string;
}

/**
 * Workflow Action: Submits task progress which in turn creates an acceptance record.
 * This is the primary entry point for users reporting progress.
 */
export async function submitTaskProgressAction(
  input: SubmitProgressInput
): Promise<ActionResult> {
  const {
    projectId,
    taskId,
    taskTitle,
    submittedQuantity,
    notes,
    applicantId,
    applicantName,
    reviewerId,
  } = input;

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) {
      throw new Error('找不到對應的專案。');
    }
    const projectData = projectSnap.data();
    const projectName = projectData.title || '未命名專案';

    const acceptanceData = {
      title: `${taskTitle} - 進度回報`,
      projectId,
      projectName,
      taskId,
      submittedQuantity,
      applicantId,
      applicantName,
      reviewerId,
      status: '待審批',
      notes: notes || '',
      submittedAt: serverTimestamp(),
      history: [
        {
          action: '提交',
          userId: applicantId,
          timestamp: new Date(),
        },
      ],
    };

    await addDoc(collection(firestore, 'acceptance_records'), acceptanceData);

    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    console.error('Submit Task Progress Error:', message);
    return { success: false, error: message };
  }
}

interface ApproveAcceptanceInput {
  acceptanceId: string;
  adminId: string; // ID of the user approving
}

/**
 * Workflow Action: Approves an acceptance record and updates the corresponding task.
 * This is the heart of the automation.
 */
export async function approveAcceptanceAction({
  acceptanceId,
  adminId,
}: ApproveAcceptanceInput): Promise<ActionResult> {
  const acceptanceRef = doc(firestore, 'acceptance_records', acceptanceId);
  const batch = writeBatch(firestore);

  try {
    const acceptanceSnap = await getDoc(acceptanceRef);
    if (!acceptanceSnap.exists()) {
      throw new Error('找不到指定的驗收單。');
    }
    const acceptanceData = acceptanceSnap.data();
    const { taskId, projectId, submittedQuantity } = acceptanceData;

    if (!taskId || !projectId || typeof submittedQuantity !== 'number') {
      throw new Error('驗收單資料不完整，無法更新任務進度。');
    }

    // 1. Update the acceptance record
    batch.update(acceptanceRef, {
      status: '已批准',
      reviewerId: adminId,
      reviewedAt: serverTimestamp(),
      history: [
        ...(acceptanceData.history || []),
        { action: '批准', userId: adminId, timestamp: new Date() },
      ],
    });

    // 2. Update the corresponding task's completedQuantity
    const projectRef = doc(firestore, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) {
      throw new Error('找不到對應的專案。');
    }
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

    const newTasks = updateRecursive(projectData.tasks || []);

    if (!taskUpdated) {
      throw new Error('在專案中找不到對應的任務ID。');
    }

    batch.update(projectRef, { tasks: newTasks });

    // Commit the atomic batch write
    await batch.commit();

    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    console.error('Approve Acceptance Error:', message);
    return { success: false, error: message };
  }
}
