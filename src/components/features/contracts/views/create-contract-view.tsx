/**
 * @fileoverview 創建合約視圖
 */
'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CreateContractDialog } from '../dialogs';
import { contractService } from '../services';
import type { Contract } from '../types';

export function CreateContractView() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>) => {
    try {
      const newId = await contractService.createContract(data);
      toast({
        title: "合約已建立",
        description: `合約 "${data.name}" 已成功新增。`,
      });
      router.push(`/contracts/${newId}`);
      return true;
    } catch (error) {
      console.error("新增合約時發生錯誤：", error);
      toast({
        title: "錯誤",
        description: "新增合約失敗，請再試一次。",
        variant: "destructive",
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
