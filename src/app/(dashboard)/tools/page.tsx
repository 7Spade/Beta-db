/**
 * @fileoverview 應用工具頁面
 * @description 整合各種應用工具的入口頁面
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Cloud } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">應用工具</h1>
          <p className="text-muted-foreground">
            整合各種實用的應用工具，提升工作效率
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              文件解析
            </CardTitle>
            <CardDescription>
              智能解析各種文件格式，提取關鍵資訊
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docu-parse">
              <Button className="w-full">使用工具</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              雲端硬碟
            </CardTitle>
            <CardDescription>
              安全的雲端檔案儲存和管理
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cloud-drive">
              <Button className="w-full">使用工具</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              更多工具
            </CardTitle>
            <CardDescription>
              更多實用工具開發中
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>即將推出</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
