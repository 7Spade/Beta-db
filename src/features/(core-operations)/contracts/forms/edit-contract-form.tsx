/**
 * @fileoverview 編輯合約表單
 */
'use client';

import type { Contract } from '@/features/(core-operations)/contracts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { ContractForm } from './contract-form';
import { contractSchema, type ContractFormValues } from './form-schemas';

interface EditContractFormProps {
  contract: Contract;
  onSubmit: (values: ContractFormValues) => void;
  children: (form: UseFormReturn<ContractFormValues>) => React.ReactNode;
}

export function EditContractForm({
  contract,
  onSubmit,
  children,
}: EditContractFormProps) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: contract,
  });

  useEffect(() => {
    form.reset(contract);
  }, [contract, form]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ContractForm />
        {children(form)}
      </form>
    </FormProvider>
  );
}
