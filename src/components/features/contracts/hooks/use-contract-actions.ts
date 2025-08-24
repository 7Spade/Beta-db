/**
 * @fileoverview 合約操作 Hook
 */
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { contractService } from '../services';
import type { Contract } from '../types';

export function useContractActions() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const createContract = async (data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>): Promise<string | null> => {
    setIsSaving(true);
    try {
      const newId = await contractService.createContract(data);
      toast({ title: "合約已建立", description: `合約 "${data.name}" 已成功新增。` });
      return newId;
    } catch (error) {
      console.error("新增合約時發生錯誤：", error);
      toast({ title: "錯誤", description: "新增合約失敗。", variant: "destructive" });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContract = async (id: string, data: Partial<Omit<Contract, 'id'>>) => {
    setIsSaving(true);
    try {
      await contractService.updateContract(id, data);
      toast({ title: "合約已更新", description: "合約資料已成功更新。" });
    } catch (error) {
      console.error("更新合約時發生錯誤：", error);
      toast({ title: "錯誤", description: "更新合約失敗。", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContract = async (id: string) => {
    setIsSaving(true);
    try {
      await contractService.deleteContract(id);
      toast({ title: "合約已刪除" });
    } catch (error) {
      console.error("刪除合約時發生錯誤：", error);
      toast({ title: "錯誤", description: "刪除合約失敗。", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    createContract,
    updateContract,
    deleteContract,
    isSaving,
  };
}
