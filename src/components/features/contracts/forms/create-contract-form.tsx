/**
 * @fileoverview 創建合約表單
 */
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema, type ContractFormValues } from './form-schemas';
import { ContractForm } from './contract-form';

interface CreateContractFormProps {
  onSubmit: (values: ContractFormValues) => void;
  children: (form: any) => React.ReactNode;
}

export function CreateContractForm({ onSubmit, children }: CreateContractFormProps) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      name: '',
      status: '啟用中',
      totalValue: 0,
      scope: '',
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ContractForm />
        {children(form)}
      </form>
    </FormProvider>
  );
}
