/**
 * @fileoverview 合約列表視圖
 */
'use client';

import { ContractsTable } from '@/features/core-operations/contracts/tables';
import type { Contract } from '@/features/core-operations/contracts/types';
import { useState } from 'react';

interface ContractListViewProps {
  contracts: Contract[];
}

export function ContractListView({ contracts }: ContractListViewProps) {
  const [sortDescriptor, setSortDescriptor] = useState<{ field: keyof Contract, direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc'
  });

  const handleSort = (field: keyof Contract) => {
    setSortDescriptor(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div>
      <ContractsTable
        contracts={contracts}
        onSort={handleSort}
        sortDescriptor={sortDescriptor}
      />
    </div>
  );
}
