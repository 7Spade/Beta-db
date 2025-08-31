/**
 * @fileoverview 合約表單邏輯 Hook
 */
'use client';

import { CONTRACT_STATUSES } from '@/features/(core-operations)/contracts/constants';
import {
  contractSchema,
  type ContractFormValues,
} from '@/features/(core-operations)/contracts/forms';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function useContractForm(contract?: Contract | null) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      customId: '',
      name: '',
      contractor: '',
      client: '',
      clientRepresentative: '',
      totalValue: 0,
      scope: '',
      status: CONTRACT_STATUSES.ACTIVE,
    },
  });

  useEffect(() => {
    if (contract) {
      form.reset({
        ...contract,
        startDate: contract.startDate instanceof Date ? contract.startDate : contract.startDate.toDate(),
        endDate: contract.endDate instanceof Date ? contract.endDate : contract.endDate.toDate(),
      });
    }
  }, [contract, form]);

  return form;
}
