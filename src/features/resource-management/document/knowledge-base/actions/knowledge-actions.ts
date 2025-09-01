"use server";

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import type { KnowledgeBaseEntry } from '@root/src/shared/types/types';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { SaveResult } from './types';

/**
 * Server Action: 儲存知識庫條目
 * 遵循 NextJS 15 Server Actions 最佳實踐
 */
export async function handleSaveKnowledgeBaseEntry(
    data: Omit<KnowledgeBaseEntry, 'id' | 'createdAt' | 'updatedAt'>,
    entryId?: string
): Promise<SaveResult> {
    try {
        if (entryId) {
            // 更新現有條目
            const entryRef = doc(firestore, 'knowledgeBaseEntries', entryId);
            await setDoc(entryRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            // 新增條目
            await addDoc(collection(firestore, 'knowledgeBaseEntries'), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        revalidatePath('/team/knowledge-base');
        return { message: `工法 "${data.title}" 已成功儲存。` };

    } catch (error) {
        console.error("儲存工法時發生錯誤：", error);
        const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
        return { error: `儲存失敗: ${errorMessage}` };
    }
}

/**
 * Server Action: 刪除知識庫條目
 */
export async function handleDeleteKnowledgeBaseEntry(entryId: string): Promise<SaveResult> {
    try {
        await deleteDoc(doc(firestore, 'knowledgeBaseEntries', entryId));
        revalidatePath('/team/knowledge-base');
        return { message: "工法已成功刪除。" };
    } catch (error) {
        console.error("刪除工法時發生錯誤：", error);
        const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
        return { error: `刪除失敗: ${errorMessage}` };
    }
}

/**
 * Server Action: 批量操作知識庫條目
 */
export async function handleBatchKnowledgeBaseOperation(
    operation: 'archive' | 'publish' | 'unpublish',
    entryIds: string[]
): Promise<SaveResult> {
    try {
        const batch = writeBatch(firestore);

        entryIds.forEach(entryId => {
            const entryRef = doc(firestore, 'knowledgeBaseEntries', entryId);
            const updateData: {
                updatedAt: ReturnType<typeof serverTimestamp>;
                status?: 'archived' | 'published' | 'draft';
            } = {
                updatedAt: serverTimestamp(),
            };

            switch (operation) {
                case 'archive':
                    updateData.status = 'archived';
                    break;
                case 'publish':
                    updateData.status = 'published';
                    break;
                case 'unpublish':
                    updateData.status = 'draft';
                    break;
            }

            batch.update(entryRef, updateData);
        });

        await batch.commit();
        revalidatePath('/team/knowledge-base');

        return { message: `已成功${operation === 'archive' ? '封存' : operation === 'publish' ? '發布' : '取消發布'} ${entryIds.length} 個工法。` };

    } catch (error) {
        console.error(`批量${operation}操作時發生錯誤：`, error);
        const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
        return { error: `批量操作失敗: ${errorMessage}` };
    }
}
