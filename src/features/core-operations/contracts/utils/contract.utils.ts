/**
 * @fileoverview 合約相關工具函數
 */

import type { Contract } from '@/features/core-operations/contracts/types';

// Placeholder for contract utility functions.
export const contractUtils = {
  // Example function
  isContractActive(contract: Contract): boolean {
    const now = new Date();
    return (
      contract.status === '啟用中' &&
      now >= contract.startDate &&
      now <= contract.endDate
    );
  },
};
