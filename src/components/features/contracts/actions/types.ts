/**
 * @fileoverview Server Actions 相關類型定義
 */

import type { Contract } from '../types';
import type { WorkItem } from "@/components/features/documents/types";

export interface CreateContractActionInput {
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>;
}

export interface CreateContractActionResult {
    success: boolean;
    contractId?: string;
    error?: string;
}
