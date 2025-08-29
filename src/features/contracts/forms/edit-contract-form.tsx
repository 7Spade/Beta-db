/**
 * @fileoverview 編輯合約表單
 */
'use client';

import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema, type ContractFormValues } from './form-schemas';
import type { Contract } from '@/components/features/contracts/types';
import { ContractForm } from './contract-form';
import { useEffect } from 'react';

interface EditContractFormProps {
  contract: Contract;
  onSubmit: (values: ContractFormValues) => void;
  children: (form: UseFormReturn<ContractFormValues>) => React.ReactNode;
}

export function EditContractForm({ contract, onSubmit, children }: EditContractFormProps) {
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
