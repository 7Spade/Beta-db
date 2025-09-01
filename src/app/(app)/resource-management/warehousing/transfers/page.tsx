/**
 * @fileoverview 跨倉調撥頁面
 * @description 管理不同倉庫間的物料調撥和庫存轉移
 */
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { PlusCircle } from 'lucide-react';

export default function InventoryTransfersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">跨倉調撥</h1>
          <p className="text-muted-foreground">
            管理不同倉庫間的物料調撥、庫存轉移和調撥單據。
          </p>
        </div>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增調撥單
        </Button>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>調撥單據歷史</CardTitle>
          <CardDescription>所有跨倉庫物料轉移的紀錄。</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium">跨倉調撥功能開發中</h3>
                <p className="text-sm text-muted-foreground mt-2">
                這裡將會顯示所有歷史調撥單據。
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
