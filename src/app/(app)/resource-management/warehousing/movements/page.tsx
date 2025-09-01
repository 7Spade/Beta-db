/**
 * @fileoverview 出入庫紀錄頁面
 * @description 追蹤物料的進出庫記錄和庫存變動
 */

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { PlusCircle } from 'lucide-react';

export default function InventoryMovementsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">出入庫紀錄</h1>
          <p className="text-muted-foreground">
            追蹤物料的進出庫記錄、庫存變動和相關單據。
          </p>
        </div>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增紀錄
        </Button>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>所有庫存移動歷史</CardTitle>
          <CardDescription>不可變的庫存移動流水帳。</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium">出入庫紀錄功能開發中</h3>
                <p className="text-sm text-muted-foreground mt-2">
                這裡將會顯示所有庫存的歷史移動紀錄。
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
