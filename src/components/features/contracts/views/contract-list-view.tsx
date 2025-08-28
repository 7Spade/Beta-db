/**
 * @fileoverview 合約列表視圖
 */
'use client';

import { ContractsTable } from '@/contracts/tables';
import type { Contract } from '@/contracts/types';

interface ContractListViewProps {
  contracts: Contract[];
}

export function ContractListView({ contracts }: ContractListViewProps) {
  return (
    <div>
      <ContractsTable contracts={contracts} />
    </div>
  );
}
