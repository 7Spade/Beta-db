'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { contractService } from '../services';
import { useContracts } from '../hooks';
import { CreateContractDialog } from '../dialogs';
import { ContractDashboard } from '../dashboard';
import { ContractsTable } from '../tables';
import type { Contract } from '../types';

export function ContractsView() {
  const { contracts, loading } = useContracts();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContract = async (data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>) => {
    try {
        await contractService.createContract(data);
        toast({
            title: "合約已建立",
            description: `合約 "${data.name}" 已成功新增。`,
        });
        setCreateDialogOpen(false);
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
