/**
 * @fileoverview 合約核心類型定義
 */
import type { Payment } from './payment.types';
import type { ChangeOrder } from './change-order.types';
import type { ContractVersion } from './contract-version.types';

export type ContractStatus = "啟用中" | "已完成" | "暫停中" | "已終止";

export interface Contract {
  id: string;
  customId?: string;
  name: string;
  contractor: string;
  client: string;
  clientRepresentative?: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: ContractStatus;
  scope: string;
  payments: Payment[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}

export interface ContractSummary {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: ContractStatus;
}
