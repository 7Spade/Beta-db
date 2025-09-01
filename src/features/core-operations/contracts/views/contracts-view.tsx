'use client';

import { ContractDashboard } from '@/features/core-operations/contracts/dashboard';
import { CreateContractDialog } from '@/features/core-operations/contracts/dialogs';
import { useContracts } from '@/features/core-operations/contracts/hooks';
import { contractService } from '@/features/core-operations/contracts/services';
import { ContractsTable } from '@/features/core-operations/contracts/tables';
import type { Contract } from '@/features/core-operations/contracts/types';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export function ContractsView() {
  const { contracts, loading } = useContracts();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContract = async (
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions' | 'receipts'>
  ) => {
    try {
      await contractService.createContract(data);
      toast({
        title: '合約已建立',
        description: `合約 "${data.name}" 已成功新增。`,
      });
      setCreateDialogOpen(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增合約
        </Button>
        <CreateContractDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={handleAddContract}
        />
      </div>

      <ContractDashboard />
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/4 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <ContractsTable contracts={contracts} />
      )}
    </div>
  );
}
