import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';

export default function CloudStoragePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Cloud className="h-6 w-6" />
        <h1 className="text-2xl font-bold">雲端儲存</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>檔案管理</CardTitle>
          <CardDescription>
            管理您在雲端儲存中的所有檔案。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            雲端儲存功能正在開發中...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
