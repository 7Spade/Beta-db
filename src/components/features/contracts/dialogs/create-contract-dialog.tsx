'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { contractSchema, type ContractFormValues } from '../forms';
import { ContractForm } from '../forms/contract-form';
import type { Contract } from '../types';

interface CreateContractDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>) => Promise<boolean>;
}

export function CreateContractDialog({ isOpen, onOpenChange, onSave }: CreateContractDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  
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
      status: '啟用中',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!isSaving) {
      onOpenChange(open);
      if (!open) {
        form.reset();
      }
    }
  }

  async function onSubmit(values: ContractFormValues) {
    setIsSaving(true);
    const success = await onSave(values);
    setIsSaving(false);
    if (success) {
      onOpenChange(false);
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>建立新合約</DialogTitle>
          <DialogDescription>
            請填寫以下詳細資訊以建立新的營造合約。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ContractForm />
            <DialogFooter>
               <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isSaving}>取消</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? '儲存中...' : '建立合約'}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
