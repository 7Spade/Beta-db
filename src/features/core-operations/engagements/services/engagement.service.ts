/**
 * @fileoverview Engagement 核心服務
 */
import { firestore } from '@/features/integrations/database/firebase-client/firebase-client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import type {
  Attachment,
  Communication,
  CreateEngagementInput,
  Document,
  Engagement,
  EngagementPhase,
  EngagementStatus,
  EngagementSummary,
  Meeting,
  UpdateEngagementInput,
} from '../types';

export class EngagementService {
  private readonly collectionName = 'engagements';

  /**
   * 驗證輸入數據
   */
  private validateEngagementInput(input: CreateEngagementInput): { isValid: boolean; error?: string } {
    if (!input.name || input.name.trim().length === 0) {
      return { isValid: false, error: '專案名稱不能為空' };
    }
    
    if (!input.contractor || input.contractor.trim().length === 0) {
      return { isValid: false, error: '承包商不能為空' };
    }
    
    if (!input.client || input.client.trim().length === 0) {
      return { isValid: false, error: '客戶不能為空' };
    }
    
    if (!input.startDate || !input.endDate) {
      return { isValid: false, error: '開始日期和結束日期不能為空' };
    }
    
    if (input.startDate >= input.endDate) {
      return { isValid: false, error: '開始日期必須早於結束日期' };
    }
    
    if (input.totalValue <= 0) {
      return { isValid: false, error: '總價值必須大於 0' };
    }
    
    if (!input.currency || input.currency.trim().length === 0) {
      return { isValid: false, error: '貨幣不能為空' };
    }
    
    return { isValid: true };
  }

  /**
   * 創建新的 Engagement
   */
  async createEngagement(input: CreateEngagementInput): Promise<{ success: boolean; engagementId?: string; error?: string }> {
    try {
      // 驗證輸入數據
      const validation = this.validateEngagementInput(input);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const engagementData = {
        ...input,
        startDate: Timestamp.fromDate(input.startDate),
        endDate: Timestamp.fromDate(input.endDate),
        paidAmount: 0,
        pendingAmount: input.totalValue,
        status: '草稿' as EngagementStatus,
        phase: '規劃' as EngagementPhase,
        tasks: [],
        payments: [],
        receipts: [],
        invoices: [],
        changeOrders: [],
        versions: [
          {
            version: 1,
            date: Timestamp.now(),
            changeSummary: '初始版本',
            changes: [],
            createdBy: 'system', // TODO: 從認證上下文獲取
          },
        ],
        milestones: [],
        deliverables: [],
        acceptanceRecords: [],
        qualityChecks: [],
        risks: [],
        issues: [],
        communications: [],
        meetings: [],
        documents: [],
        attachments: [],
        auditLog: [],
        createdBy: 'system', // TODO: 從認證上下文獲取
        createdAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(firestore, this.collectionName), engagementData);

      return { success: true, engagementId: docRef.id };
    } catch (error) {
      console.error('創建 Engagement 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `創建失敗: ${errorMessage}` };
    }
  }

  /**
   * 獲取所有 Engagements
   */
  async getEngagements(options?: {
    status?: EngagementStatus;
    phase?: EngagementPhase;
    limit?: number;
    startAfter?: any;
  }): Promise<{ success: boolean; engagements?: Engagement[]; error?: string }> {
    try {
      let q = query(collection(firestore, this.collectionName));

      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }

      if (options?.phase) {
        q = query(q, where('phase', '==', options.phase));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      if (options?.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const snapshot = await getDocs(q);
      const engagements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Engagement[];

      return { success: true, engagements };
    } catch (error) {
      console.error('獲取 Engagements 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `獲取失敗: ${errorMessage}` };
    }
  }

  /**
   * 獲取單個 Engagement
   */
  async getEngagement(id: string): Promise<{ success: boolean; engagement?: Engagement; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const engagement = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Engagement;

      return { success: true, engagement };
    } catch (error) {
      console.error('獲取 Engagement 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `獲取失敗: ${errorMessage}` };
    }
  }

  /**
   * 更新 Engagement
   */
  async updateEngagement(
    id: string,
    input: UpdateEngagementInput
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, id);

      const updateData = {
        ...input,
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      // 處理日期轉換
      if (input.startDate) {
        (updateData as any).startDate = Timestamp.fromDate(input.startDate);
      }
      if (input.endDate) {
        (updateData as any).endDate = Timestamp.fromDate(input.endDate);
      }
      if (input.actualStartDate) {
        (updateData as any).actualStartDate = Timestamp.fromDate(input.actualStartDate);
      }
      if (input.actualEndDate) {
        (updateData as any).actualEndDate = Timestamp.fromDate(input.actualEndDate);
      }

      await updateDoc(docRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('更新 Engagement 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 刪除 Engagement
   */
  async deleteEngagement(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      await deleteDoc(docRef);

      return { success: true };
    } catch (error) {
      console.error('刪除 Engagement 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `刪除失敗: ${errorMessage}` };
    }
  }

  /**
   * 獲取 Engagement 摘要列表
   */
  async getEngagementSummaries(options?: {
    status?: EngagementStatus;
    phase?: EngagementPhase;
    limit?: number;
  }): Promise<{ success: boolean; summaries?: EngagementSummary[]; error?: string }> {
    try {
      const result = await this.getEngagements(options);

      if (!result.success || !result.engagements) {
        return result;
      }

      const summaries: EngagementSummary[] = result.engagements.map(engagement => ({
        id: engagement.id,
        customId: engagement.customId,
        name: engagement.name,
        contractor: engagement.contractor,
        client: engagement.client,
        startDate: engagement.startDate,
        endDate: engagement.endDate,
        totalValue: engagement.totalValue,
        status: engagement.status,
        phase: engagement.phase,
        progressPercentage: this.calculateProgressPercentage(engagement),
      }));

      return { success: true, summaries };
    } catch (error) {
      console.error('獲取 Engagement 摘要失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `獲取失敗: ${errorMessage}` };
    }
  }

  /**
   * 批量更新 Engagements
   */
  async batchUpdateEngagements(
    updates: Array<{ id: string; data: UpdateEngagementInput }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 驗證所有更新數據
      for (const { data } of updates) {
        if (data.startDate && data.endDate && data.startDate >= data.endDate) {
          return { success: false, error: '開始日期必須早於結束日期' };
        }
        if (data.totalValue !== undefined && data.totalValue <= 0) {
          return { success: false, error: '總價值必須大於 0' };
        }
      }

      const batch = writeBatch(firestore);

      updates.forEach(({ id, data }) => {
        const docRef = doc(firestore, this.collectionName, id);
        const updateData = {
          ...data,
          updatedBy: 'system', // TODO: 從認證上下文獲取
          updatedAt: Timestamp.now(),
        };

        // 處理日期轉換
        if (data.startDate) {
          (updateData as any).startDate = Timestamp.fromDate(data.startDate);
        }
        if (data.endDate) {
          (updateData as any).endDate = Timestamp.fromDate(data.endDate);
        }
        if (data.actualStartDate) {
          (updateData as any).actualStartDate = Timestamp.fromDate(data.actualStartDate);
        }
        if (data.actualEndDate) {
          (updateData as any).actualEndDate = Timestamp.fromDate(data.actualEndDate);
        }

        batch.update(docRef, updateData);
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('批量更新 Engagements 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `批量更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 使用事務更新 Engagement
   */
  async updateEngagementWithTransaction(
    id: string,
    input: UpdateEngagementInput,
    additionalUpdates?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { runTransaction } = await import('firebase/firestore');
      
      const result = await runTransaction(firestore, async (transaction) => {
        const docRef = doc(firestore, this.collectionName, id);
        const docSnap = await transaction.get(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Engagement 不存在');
        }
        
        const currentData = docSnap.data();
        const updateData = {
          ...input,
          ...additionalUpdates,
          updatedBy: 'system', // TODO: 從認證上下文獲取
          updatedAt: Timestamp.now(),
        };
        
        // 處理日期轉換
        if (input.startDate) {
          (updateData as any).startDate = Timestamp.fromDate(input.startDate);
        }
        if (input.endDate) {
          (updateData as any).endDate = Timestamp.fromDate(input.endDate);
        }
        if (input.actualStartDate) {
          (updateData as any).actualStartDate = Timestamp.fromDate(input.actualStartDate);
        }
        if (input.actualEndDate) {
          (updateData as any).actualEndDate = Timestamp.fromDate(input.actualEndDate);
        }
        
        transaction.update(docRef, updateData);
        
        return { success: true };
      });
      
      return result;
    } catch (error) {
      console.error('事務更新 Engagement 失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 計算進度百分比
   */
  private calculateProgressPercentage(engagement: Engagement): number {
    if (engagement.tasks.length === 0) {
      return 0;
    }

    const totalValue = engagement.tasks.reduce((sum, task) => sum + task.value, 0);
    const completedValue = engagement.tasks.reduce(
      (sum, task) => sum + (task.value * task.completedQuantity / task.quantity),
      0
    );

    return totalValue > 0 ? Math.round((completedValue / totalValue) * 100) : 0;
  }

  // ==================== 溝通管理方法 ====================

  /**
   * 添加溝通記錄
   */
  async addCommunication(engagementId: string, communication: Omit<Communication, 'id'>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const newCommunication: Communication = {
        ...communication,
        id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: 'system',
        updatedBy: 'system',
      };

      const updatedCommunications = [...engagement.engagement.communications, newCommunication];

      await updateDoc(docRef, {
        communications: updatedCommunications,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('添加溝通記錄失敗:', error);
      return { success: false, error: '添加溝通記錄失敗' };
    }
  }

  /**
   * 更新溝通記錄
   */
  async updateCommunication(engagementId: string, communicationId: string, updates: Partial<Communication>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedCommunications = engagement.engagement.communications.map(comm =>
        comm.id === communicationId
          ? { ...comm, ...updates, updatedAt: Timestamp.now(), updatedBy: 'system' }
          : comm
      );

      await updateDoc(docRef, {
        communications: updatedCommunications,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('更新溝通記錄失敗:', error);
      return { success: false, error: '更新溝通記錄失敗' };
    }
  }

  /**
   * 刪除溝通記錄
   */
  async deleteCommunication(engagementId: string, communicationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedCommunications = engagement.engagement.communications.filter(comm => comm.id !== communicationId);

      await updateDoc(docRef, {
        communications: updatedCommunications,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('刪除溝通記錄失敗:', error);
      return { success: false, error: '刪除溝通記錄失敗' };
    }
  }

  // ==================== 會議管理方法 ====================

  /**
   * 添加會議
   */
  async addMeeting(engagementId: string, meeting: Omit<Meeting, 'id'>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const newMeeting: Meeting = {
        ...meeting,
        id: `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: 'system',
        updatedBy: 'system',
      };

      const updatedMeetings = [...engagement.engagement.meetings, newMeeting];

      await updateDoc(docRef, {
        meetings: updatedMeetings,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('添加會議失敗:', error);
      return { success: false, error: '添加會議失敗' };
    }
  }

  /**
   * 更新會議
   */
  async updateMeeting(engagementId: string, meetingId: string, updates: Partial<Meeting>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedMeetings = engagement.engagement.meetings.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, ...updates, updatedAt: Timestamp.now(), updatedBy: 'system' }
          : meeting
      );

      await updateDoc(docRef, {
        meetings: updatedMeetings,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('更新會議失敗:', error);
      return { success: false, error: '更新會議失敗' };
    }
  }

  /**
   * 刪除會議
   */
  async deleteMeeting(engagementId: string, meetingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedMeetings = engagement.engagement.meetings.filter(meeting => meeting.id !== meetingId);

      await updateDoc(docRef, {
        meetings: updatedMeetings,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('刪除會議失敗:', error);
      return { success: false, error: '刪除會議失敗' };
    }
  }

  // ==================== 文件管理方法 ====================

  /**
   * 添加文件
   */
  async addDocument(engagementId: string, document: Omit<Document, 'id'>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const newDocument: Document = {
        ...document,
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: 'system',
        updatedBy: 'system',
      };

      const updatedDocuments = [...engagement.engagement.documents, newDocument];

      await updateDoc(docRef, {
        documents: updatedDocuments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('添加文件失敗:', error);
      return { success: false, error: '添加文件失敗' };
    }
  }

  /**
   * 更新文件
   */
  async updateDocument(engagementId: string, documentId: string, updates: Partial<Document>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedDocuments = engagement.engagement.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, ...updates, updatedAt: Timestamp.now(), updatedBy: 'system' }
          : doc
      );

      await updateDoc(docRef, {
        documents: updatedDocuments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('更新文件失敗:', error);
      return { success: false, error: '更新文件失敗' };
    }
  }

  /**
   * 刪除文件
   */
  async deleteDocument(engagementId: string, documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedDocuments = engagement.engagement.documents.filter(doc => doc.id !== documentId);

      await updateDoc(docRef, {
        documents: updatedDocuments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('刪除文件失敗:', error);
      return { success: false, error: '刪除文件失敗' };
    }
  }

  // ==================== 附件管理方法 ====================

  /**
   * 添加附件
   */
  async addAttachment(engagementId: string, attachment: Omit<Attachment, 'id'>): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const newAttachment: Attachment = {
        ...attachment,
        id: `attach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uploadedAt: Timestamp.now(),
        createdBy: 'system',
      };

      const updatedAttachments = [...engagement.engagement.attachments, newAttachment];

      await updateDoc(docRef, {
        attachments: updatedAttachments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('添加附件失敗:', error);
      return { success: false, error: '添加附件失敗' };
    }
  }

  /**
   * 刪除附件
   */
  async deleteAttachment(engagementId: string, attachmentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      const engagement = await this.getEngagement(engagementId);

      if (!engagement.success || !engagement.engagement) {
        return { success: false, error: 'Engagement 不存在' };
      }

      const updatedAttachments = engagement.engagement.attachments.filter(attach => attach.id !== attachmentId);

      await updateDoc(docRef, {
        attachments: updatedAttachments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      });

      return { success: true };
    } catch (error) {
      console.error('刪除附件失敗:', error);
      return { success: false, error: '刪除附件失敗' };
    }
  }
}

// 導出單例實例
export const engagementService = new EngagementService();