/**
 * @fileoverview Engagement 核心服務
 */
import { firestore } from '@/features/integrations/database/firebase-client/firebase-client';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import type {
  Engagement,
  EngagementSummary,
  CreateEngagementInput,
  UpdateEngagementInput,
  EngagementStatus,
  EngagementPhase,
} from '../types';

export class EngagementService {
  private readonly collectionName = 'engagements';

  /**
   * 創建新的 Engagement
   */
  async createEngagement(input: CreateEngagementInput): Promise<{ success: boolean; engagementId?: string; error?: string }> {
    try {
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
}

// 導出單例實例
export const engagementService = new EngagementService();