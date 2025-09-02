/**
 * @fileoverview 文件管理服務
 */
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import type {
  Document,
  Attachment,
  CreateDocumentInput,
  CreateAttachmentInput,
  DocumentSummary,
} from '../types';

export class DocumentService {
  private readonly collectionName = 'engagements';

  /**
   * 添加文件
   */
  async addDocument(
    engagementId: string,
    input: CreateDocumentInput
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      const document: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        version: '1.0',
        status: 'draft',
        createdBy: 'system', // TODO: 從認證上下文獲取
        createdAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        documents: arrayUnion(document),
        updatedAt: Timestamp.now(),
      });

      return { success: true, documentId: document.id };
    } catch (error) {
      console.error('添加文件失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `添加失敗: ${errorMessage}` };
    }
  }

  /**
   * 添加附件
   */
  async addAttachment(
    engagementId: string,
    input: CreateAttachmentInput
  ): Promise<{ success: boolean; attachmentId?: string; error?: string }> {
    try {
      const attachment: Attachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        uploadedBy: 'system', // TODO: 從認證上下文獲取
        uploadedAt: Timestamp.now(),
      };

      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        attachments: arrayUnion(attachment),
        updatedAt: Timestamp.now(),
      });

      return { success: true, attachmentId: attachment.id };
    } catch (error) {
      console.error('添加附件失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `添加失敗: ${errorMessage}` };
    }
  }

  /**
   * 計算文件摘要
   */
  calculateDocumentSummary(documents: Document[], attachments: Attachment[]): DocumentSummary {
    const totalDocuments = documents.length;
    const draftDocuments = documents.filter(d => d.status === 'draft').length;
    const reviewDocuments = documents.filter(d => d.status === 'review').length;
    const approvedDocuments = documents.filter(d => d.status === 'approved').length;
    const publishedDocuments = documents.filter(d => d.status === 'published').length;
    const archivedDocuments = documents.filter(d => d.status === 'archived').length;

    const totalSize = [...documents, ...attachments].reduce((sum, item) => sum + item.fileSize, 0);

    const recentDocuments = documents
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 5);

    return {
      totalDocuments,
      draftDocuments,
      reviewDocuments,
      approvedDocuments,
      publishedDocuments,
      archivedDocuments,
      totalSize,
      recentDocuments,
    };
  }
}

// 導出單例實例
export const documentService = new DocumentService();