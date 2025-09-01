/**
 * @fileoverview 物料主檔管理頁面
 * @description 管理所有物料的基礎資訊、規格和庫存
 */

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { PlusCircle } from 'lucide-react';

export default function InventoryItemsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">物料主檔</h1>
          <p className="text-muted-foreground">
            管理所有物料的基礎資訊、規格和分類。
          </p>
        </div>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增物料
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>物料列表</CardTitle>
          <CardDescription>全公司的統一物料目錄。</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">物料主檔功能開發中</h3>
            <p className="text-sm text-muted-foreground mt-2">
              這裡將會顯示所有物料的列表與管理介面。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
