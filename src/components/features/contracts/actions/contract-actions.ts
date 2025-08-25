"use server";

import { writeBatch, collection, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Task, Project } from "@/lib/types";
import type { Contract } from '../types';
import type { WorkItem, DocDetails } from "@/components/features/documents/types";

interface ActionInput {
    docDetails: DocDetails;
    workItems: WorkItem[];
}

interface ActionResult {
    projectId?: string;
    contractId?: string;
    error?: string;
}

// Helper to convert work items to tasks
function workItemsToTasks(items: WorkItem[]): Task[] {
    return items.map((item, index) => ({
        id: `task-${Date.now()}-${index}`,
        title: item.name,
        status: '待處理',
        lastUpdated: new Date().toISOString(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        value: item.quantity * item.unitPrice, // Calculate total value
        subTasks: [],
    }));
}

/**
 * Server Action: 從文件創建專案和合約
 * 遵循 NextJS 15 Server Actions 最佳實踐
 */
export async function createProjectAndContractFromDocument(input: ActionInput): Promise<ActionResult> {
    const { docDetails, workItems } = input;
    const batch = writeBatch(db);

    try {
        // 1. Prepare Project data
        const newProjectRef = doc(collection(db, "projects"));
        const projectId = newProjectRef.id;
        const totalValue = workItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const tasks = workItemsToTasks(workItems);

        const projectData: Omit<Project, "id" | "startDate" | "endDate"> & { startDate: Timestamp, endDate: Timestamp } = {
            customId: docDetails.customId,
            title: docDetails.name,
            description: `從文件 "${docDetails.name}" 建立的專案`,
            client: docDetails.client,
            clientRepresentative: docDetails.clientRepresentative,
            value: totalValue,
            tasks: tasks,
            startDate: Timestamp.now(),
            // Placeholder end date, maybe 1 month from now
            endDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        };
        batch.set(newProjectRef, projectData);

        // 2. Prepare Contract data
        const newContractRef = doc(collection(db, "contracts"));
        const contractId = newContractRef.id;

        const contractData: Omit<Contract, "id" | "startDate" | "endDate" | "payments" | "changeOrders" | "versions"> & { startDate: Timestamp, endDate: Timestamp, payments: [], changeOrders: [], versions: any[] } = {
            customId: docDetails.customId,
            name: docDetails.name,
            contractor: "本公司", // Placeholder value
            client: docDetails.client,
            clientRepresentative: docDetails.clientRepresentative,
            totalValue: totalValue,
            status: "啟用中",
            scope: `基於文件 "${docDetails.name}" 的工作項目。`,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            payments: [],
            changeOrders: [],
            versions: [{
                version: 1,
                date: Timestamp.now(),
                changeSummary: "從文件提取的初始版本"
            }]
        };
        batch.set(newContractRef, contractData);

        // Commit the batch
        await batch.commit();

        return { projectId, contractId };

    } catch (e) {
        console.error("從文件建立專案和合約時發生錯誤：", e);
        const errorMessage = e instanceof Error ? e.message : "發生未知錯誤。";
        return { error: `建立失敗：${errorMessage}` };
    }
}

/**
 * Server Action: 創建合約（與現有服務層整合）
 */
export async function createContractAction(data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>): Promise<{ success: boolean; contractId?: string; error?: string }> {
    try {
        // 這裡可以調用現有的 contractService.createContract
        // 或者直接實現邏輯以保持一致性
        const newContractRef = doc(collection(db, "contracts"));
        const contractId = newContractRef.id;

        const contractData = {
            ...data,
            startDate: Timestamp.fromDate(data.startDate),
            endDate: Timestamp.fromDate(data.endDate),
            payments: [],
            changeOrders: [],
            versions: [{
                version: 1,
                date: Timestamp.now(),
                changeSummary: "初始版本"
            }]
        };

        await newContractRef.set(contractData);

        return { success: true, contractId };
    } catch (e) {
        console.error("創建合約時發生錯誤：", e);
        const errorMessage = e instanceof Error ? e.message : "發生未知錯誤。";
        return { success: false, error: `創建失敗：${errorMessage}` };
    }
}
