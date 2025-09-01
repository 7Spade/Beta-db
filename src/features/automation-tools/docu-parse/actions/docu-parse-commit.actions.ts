/**
 * @fileoverview Server Action for committing parsed document data.
 * @description This action is responsible for taking the verified data from the DocuParse UI
 * and creating the corresponding project and contract documents in the database.
 */
'use server';

import type { DocDetails, WorkItem } from '@/features/automation-tools/docu-parse/types';
import type { Task } from '@/features/core-operations/projects/types';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { collection, doc, Timestamp, writeBatch } from 'firebase/firestore';

// Helper to convert work items to tasks, now including discount
function workItemsToTasks(items: WorkItem[]): Task[] {
  return items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0; // Ensure discount is a number, default to 0
    return {
      id: `task-${Date.now()}-${index}`,
      title: item.name,
      lastUpdated: new Date().toISOString(),
      quantity: quantity,
      unitPrice: unitPrice,
      discount: discount,
      value: quantity * unitPrice - discount, // Net value
      subTasks: [],
      completedQuantity: 0,
    };
  });
}

// Helper to convert work items to a readable scope string for contracts, now including discount
function workItemsToScope(items: WorkItem[], contractName: string): string {
  const lines: string[] = [];
  lines.push(`「${contractName}」工作範疇（依文件解析生成）：`);
  lines.push('');
  items.forEach((item, index) => {
    const lineNumber = item.id || String(index + 1);
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0; // Ensure discount is a number
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

interface ActionInput {
    docDetails: DocDetails;
    workItems: WorkItem[];
}

interface ActionResult {
    projectId?: string;
    contractId?: string;
    error?: string;
}

/**
 * Server Action: Creates a project and a contract from the parsed and verified document data.
 */
export async function createProjectAndContractFromParsedData(
    input: ActionInput
): Promise<ActionResult> {
    const { docDetails, workItems } = input;
    const batch = writeBatch(firestore);

    try {
        // 1. Prepare Project data
        const newProjectRef = doc(collection(firestore, 'projects'));
        const projectId = newProjectRef.id;
        
        // Correctly calculate total value including discounts
        const totalValue = workItems.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0),
            0
        );
        const tasks = workItemsToTasks(workItems);

        const projectData = {
            customId: docDetails.customId,
            title: docDetails.name,
            description: `從文件 "${docDetails.name}" 建立的專案`,
            client: docDetails.client,
            clientRepresentative: docDetails.clientRepresentative,
            value: totalValue,
            tasks: tasks,
            startDate: Timestamp.now(),
            endDate: Timestamp.fromDate(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            ), // Placeholder: 30 days from now
        };
        batch.set(newProjectRef, projectData);

        // 2. Prepare Contract data
        const newContractRef = doc(collection(firestore, 'contracts'));
        const contractId = newContractRef.id;

        const contractData = {
            projectId: projectId, // **核心修改：關聯專案 ID**
            customId: docDetails.customId,
            name: docDetails.name,
            contractor: '本公司', // Placeholder value
            client: docDetails.client,
            clientRepresentative: docDetails.clientRepresentative,
            totalValue: totalValue, // Use corrected total value
            status: '啟用中',
            scope: workItemsToScope(workItems, docDetails.name), // Use updated scope text
            tasks: tasks, // **核心修改：儲存結構化的任務快照**
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            payments: [],
            receipts: [],
            changeOrders: [],
            versions: [
                {
                    version: 1,
                    date: Timestamp.now(),
                    changeSummary: '從文件提取的初始版本',
                },
            ],
        };
        batch.set(newContractRef, contractData);

        // Commit the batch
        await batch.commit();

        return { projectId, contractId };
    } catch (e) {
        console.error('從文件建立專案和合約時發生錯誤：', e);
        const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
        return { error: `建立失敗：${errorMessage}` };
    }
}
