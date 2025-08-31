/**
 * @fileoverview 合約核心類型定義
 */
import type { Timestamp } from '@firebase/firestore';
import type { ChangeOrder } from './change-order.types';
import type { ContractVersion } from './contract-version.types';
import type { Payment } from './payment.types';
import type { Receipt } from './receipt.types';

export type ContractStatus = '啟用中' | '已完成' | '暫停中' | '已終止';

export interface Contract {
  id: string;
  customId?: string;
  name: string;
  contractor: string;
  client: string;
  clientRepresentative?: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  totalValue: number;
  status: ContractStatus;
  scope: string;
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
