
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';
import { useStorageFiles } from '../hooks/use-storage-files';
import { FileBrowser } from '../components/file-browser';
import { UploadButton } from '../components/upload-button';

export function CloudStorageView() {
    const { files, isLoading, error, refresh } = useStorageFiles('uploads/');
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">雲端儲存</h1>
            <p className="text-muted-foreground">管理您在 Firebase Storage 中的所有檔案。</p>
        </div>
        <UploadButton onUploadComplete={refresh} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>檔案瀏覽器</CardTitle>
          <CardDescription>
            目前路徑: /uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
            {error && <p className="text-destructive text-center">{error}</p>}
            <FileBrowser files={files} isLoading={isLoading} onActionComplete={refresh} />
        </CardContent>
      </Card>
    </div>
  );
}
