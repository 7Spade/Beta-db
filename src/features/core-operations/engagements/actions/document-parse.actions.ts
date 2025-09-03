/**
 * @fileoverview 從文件解析創建 Engagement 的 Server Actions
 * @description 將文件解析功能整合到 engagements 模組中，創建統一的 Engagement 而不是分別的 Project 和 Contract
 */
'use server';

import type { DocDetails, WorkItem } from '@/features/automation-tools/docu-parse/types';
import type { Engagement, Task } from '@/features/core-operations/engagements/types';
import { firestore } from '@/features/integrations/database/firebase-client/firebase-client';
import { collection, doc, Timestamp, writeBatch } from 'firebase/firestore';

// 將 WorkItem 轉換為 Task
function workItemsToTasks(items: WorkItem[]): Task[] {
  return items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    return {
      id: `task-${Date.now()}-${index}`,
      title: item.name,
      description: (item as any).description || '',
      quantity: quantity,
      unitPrice: unitPrice,
      discount: discount,
      value: quantity * unitPrice - discount,
      status: '待處理',
      priority: '中',
      lastUpdated: new Date(),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天後
      completedQuantity: 0,
      subTasks: [],
      assignedTo: '',
      tags: [],
      attachments: [],
      comments: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedBy: 'system',
      updatedAt: new Date(),
    };
  });
}

// 將 WorkItem 轉換為工作範疇描述
function workItemsToScope(items: WorkItem[], engagementName: string): string {
  const lines: string[] = [];
  lines.push(`「${engagementName}」工作範疇（依文件解析生成）：`);
  lines.push('');
  items.forEach((item, index) => {
    const lineNumber = item.id || String(index + 1);
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const subtotal = quantity * unitPrice - discount;
    lines.push(
      `${lineNumber}. ${item.name}（數量：${quantity}，單價：${unitPrice}, 折扣：${discount}, 小計：${subtotal.toLocaleString()}）`
    );
  });
  const total = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0) - (Number(it.discount) || 0),
    0
  );
  lines.push('');
  lines.push(`合計總金額（已扣除折扣）：${total.toLocaleString()}`);
  return lines.join('\n');
}

interface CreateEngagementFromDocumentInput {
  docDetails: DocDetails;
  workItems: WorkItem[];
}

interface CreateEngagementFromDocumentResult {
  engagementId?: string;
  error?: string;
}

/**
 * 從文件解析數據創建統一的 Engagement
 */
export async function createEngagementFromDocument(
  input: CreateEngagementFromDocumentInput
): Promise<CreateEngagementFromDocumentResult> {
  const { docDetails, workItems } = input;
  const batch = writeBatch(firestore);

  try {
    // 計算總價值（包含折扣）
    const totalValue = workItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0),
      0
    );

    const tasks = workItemsToTasks(workItems);
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天後

    // 創建 Engagement 文檔
    const newEngagementRef = doc(collection(firestore, 'engagements'));
    const engagementId = newEngagementRef.id;

    const engagementData: Omit<Engagement, 'id'> = {
      customId: docDetails.customId,
      name: docDetails.name,
      description: `從文件 "${docDetails.name}" 建立的專案合約`,
      contractor: '本公司',
      client: docDetails.client,
      clientRepresentative: docDetails.clientRepresentative,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(endDate),
      totalValue: totalValue,
      paidAmount: 0,
      pendingAmount: totalValue,
      currency: 'TWD',
      status: '已簽約',
      phase: '規劃',
      scope: workItemsToScope(workItems, docDetails.name),
      tasks: tasks,
      payments: [],
      receipts: [],
      invoices: [],
      changeOrders: [],
      versions: [
        {
          version: 1,
          date: Timestamp.fromDate(now),
          changeSummary: '從文件提取的初始版本',
          changes: [],
          createdBy: 'system',
          approvedBy: '',
          approvedDate: Timestamp.fromDate(now),
        },
      ],
      progress: {
        overallProgress: 0,
        taskProgress: 0,
        financialProgress: 0,
        lastUpdated: Timestamp.fromDate(now),
      },
      milestones: [],
      deliverables: [],
      qualityChecks: [],
      risks: [],
      issues: [],
      communications: [],
      meetings: [],
      documents: [],
      attachments: [],
      auditLog: [
        {
          id: `audit-${Date.now()}`,
          entityType: 'engagement',
          entityId: engagementId,
          action: 'create',
          userId: 'system',
          userName: '系統',
          timestamp: Timestamp.fromDate(now),
          changes: [],
        },
      ],
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    batch.set(newEngagementRef, engagementData);

    // 提交批次操作
    await batch.commit();

    return { engagementId };
  } catch (e) {
    console.error('從文件創建 Engagement 時發生錯誤：', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { error: `創建失敗：${errorMessage}` };
  }
}
