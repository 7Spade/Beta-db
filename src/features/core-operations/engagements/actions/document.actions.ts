'use server';

import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase/firestore';
import { engagementService } from '../services/engagement.service';
import type {
  Document,
  Attachment,
  CreateDocumentInput,
  UpdateDocumentInput,
  CreateAttachmentInput,
} from '../types/document.types';

/**
 * 添加文件
 */
export async function addDocumentAction(
  engagementId: string,
  data: CreateDocumentInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const document: Omit<Document, 'id'> = {
      ...data,
      status: 'draft',
      version: '1.0',
      createdBy: 'current-user', // TODO: 從認證系統獲取
      createdAt: Timestamp.now(),
      updatedBy: 'current-user',
      updatedAt: Timestamp.now(),
    };

    await engagementService.addDocument(engagementId, document);
    revalidatePath(`/core-operations/engagements/${engagementId}`);
    revalidatePath('/core-operations/engagements');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '添加文件失敗' 
    };
  }
}

/**
 * 更新文件
 */
export async function updateDocumentAction(
  engagementId: string,
  documentId: string,
  data: UpdateDocumentInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Partial<Document> = {
      ...data,
      publishedDate: data.publishedDate instanceof Date ? Timestamp.fromDate(data.publishedDate) : data.publishedDate,
      archivedDate: data.archivedDate instanceof Date ? Timestamp.fromDate(data.archivedDate) : data.archivedDate,
      updatedBy: 'current-user',
      updatedAt: Timestamp.now(),
    };

    await engagementService.updateDocument(engagementId, documentId, updateData);
    revalidatePath(`/core-operations/engagements/${engagementId}`);
    revalidatePath('/core-operations/engagements');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新文件失敗' 
    };
  }
}

/**
 * 刪除文件
 */
export async function deleteDocumentAction(
  engagementId: string,
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await engagementService.deleteDocument(engagementId, documentId);
    revalidatePath(`/core-operations/engagements/${engagementId}`);
    revalidatePath('/core-operations/engagements');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '刪除文件失敗' 
    };
  }
}

/**
 * 添加附件
 */
export async function addAttachmentAction(
  engagementId: string,
  data: CreateAttachmentInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const attachment: Omit<Attachment, 'id'> = {
      ...data,
      uploadedBy: 'current-user', // TODO: 從認證系統獲取
      uploadedAt: Timestamp.now(),
    };

    await engagementService.addAttachment(engagementId, attachment);
    revalidatePath(`/core-operations/engagements/${engagementId}`);
    revalidatePath('/core-operations/engagements');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding attachment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '添加附件失敗' 
    };
  }
}

/**
 * 刪除附件
 */
export async function deleteAttachmentAction(
  engagementId: string,
  attachmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await engagementService.deleteAttachment(engagementId, attachmentId);
    revalidatePath(`/core-operations/engagements/${engagementId}`);
    revalidatePath('/core-operations/engagements');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '刪除附件失敗' 
    };
  }
}
