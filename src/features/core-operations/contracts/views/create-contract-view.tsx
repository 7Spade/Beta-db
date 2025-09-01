/**
 * @fileoverview 創建合約視圖
 */
'use client';

import { CreateContractDialog } from '@/features/core-operations/contracts/dialogs';
import { contractService } from '@/features/core-operations/contracts/services';
import type { Contract } from '@/features/core-operations/contracts/types';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function CreateContractView() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions' | 'receipts'>
  ) => {
    try {
      const newId = await contractService.createContract(data);
      toast({
        title: '合約已建立',
        description: `合約 "${data.name}" 已成功新增。`,
      });
      router.push(`/contracts/${newId}`);
      return true;
    } catch (error) {
      console.error('新增合約時發生錯誤：', error);
      toast({
        title: '錯誤',
        description: '新增合約失敗，請再試一次。',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <CreateContractDialog
      isOpen={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.back();
        }
      }}
      onSave={handleSave}
    />
  );
}
