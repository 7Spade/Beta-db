'use server';

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { AcceptanceRecord, Task } from '@/lib/types/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';

interface CreateAcceptanceInput {
  title: string;
  projectId: string;
  projectName: string;
  applicantId: string;
  applicantName: string;
  reviewerId: string;
  linkedTaskIds: string[];
  notes?: string;
}

export async function createAcceptanceRecord(
  input: CreateAcceptanceInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const record: Omit<AcceptanceRecord, 'id'> = {
      ...input,
      status: '草稿',
      submittedAt: new Date(),
      history: [
        { action: '建立', userId: input.applicantId, timestamp: new Date() },
      ],
    };

    await addDoc(collection(firestore, 'acceptance_records'), {
      ...record,
      submittedAt: serverTimestamp(),
      history: [
        {
          action: '建立',
          userId: input.applicantId,
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

export async function submitAcceptanceRecord(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const recordRef = doc(firestore, 'acceptance_records', id);
    await updateDoc(recordRef, {
      status: '待審批',
      history: [
        ...((await (await recordRef.get()).data())?.history || []),
        {
          action: '提交審批',
          userId: 'current_user_id', // Replace with actual user ID
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

export async function approveAcceptanceRecord(
  id: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const batch = writeBatch(firestore);

    // 1. 更新驗收單狀態
    const recordRef = doc(firestore, 'acceptance_records', id);
    batch.update(recordRef, {
      status: '已批准',
      reviewedAt: serverTimestamp(),
      history: [
        ...((await (await recordRef.get()).data())?.history || []),
        {
          action: '批准',
          userId: 'current_user_id', // Replace with actual user ID
          timestamp: serverTimestamp(),
        },
      ],
    });

    // 2. (可選) 更新對應任務的狀態 - 這裡我們先不實作，保持解耦

    await batch.commit();
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: message };
  }
}
