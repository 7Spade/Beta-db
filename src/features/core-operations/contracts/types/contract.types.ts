/**
 * @fileoverview 合約核心類型定義
 */
import type { Timestamp } from '@firebase/firestore';
import type { ChangeOrder } from './change-order.types';
import type { ContractVersion } from './contract-version.types';
import type { Payment } from './payment.types';
import type { Receipt } from './receipt.types';
import type { Task } from '@/features/core-operations/projects/types';

export type ContractStatus = '啟用中' | '已完成' | '暫停中' | '已終止';

export interface Contract {
  id: string;
  projectId?: string; // 新增，用於關聯專案
  customId?: string;
  name: string;
  contractor: string;
  client: string;
  clientRepresentative?: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  totalValue: number;
  status: ContractStatus;
  scope: string; // 雖然不再是主要顯示方式，但仍保留做為文字參考
  tasks: Task[]; // 將用於顯示結構化工作範疇
  payments: Payment[];
  receipts: Receipt[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}

export interface ContractSummary {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  totalValue: number;
  status: ContractStatus;
}
