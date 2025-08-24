/**
 * @fileoverview Server Actions 相關類型定義
 */

import type { Contract } from '../types';
import type { WorkItem } from "@/components/features/documents/work-items-table";

export interface DocDetails {
    customId: string;
    name: string;
    client: string;
    clientRepresentative: string;
}

export interface ActionInput {
    docDetails: DocDetails;
    workItems: WorkItem[];
}

export interface ActionResult {
    projectId?: string;
    contractId?: string;
    error?: string;
}

export interface CreateContractActionInput {
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>;
}

export interface CreateContractActionResult {
    success: boolean;
    contractId?: string;
    error?: string;
}