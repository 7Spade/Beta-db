/**
 * @fileoverview 合約列表視圖
 */
'use client';

import { ContractsTable } from '../tables';
import type { Contract } from '../types';

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
