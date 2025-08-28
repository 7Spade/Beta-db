/**
 * @fileoverview 合約表單邏輯 Hook
 */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema, type ContractFormValues } from '@/components/features/contracts/forms';
import { CONTRACT_STATUSES } from '@/components/features/contracts/constants';
import type { Contract } from '@/components/features/contracts/types';
import { useEffect } from 'react';

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
      form.reset(contract);
    }
  }, [contract, form]);

  return form;
}
