/**
 * @fileoverview 倉庫管理頁面
 * @description 管理倉庫基本資訊、配置和庫位管理
 */
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { PlusCircle } from 'lucide-react';


export default function WarehousesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">倉庫管理</h1>
          <p className="text-muted-foreground">
            管理您的所有倉庫據點。
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增倉庫
        </Button>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>倉庫列表</CardTitle>
          <CardDescription>您所有的實體倉庫或工地庫房。</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium">倉庫管理功能開發中</h3>
                <p className="text-sm text-muted-foreground mt-2">
                這裡將會顯示您所有的倉庫列表。
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
