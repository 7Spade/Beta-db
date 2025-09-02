/**
 * @fileoverview Engagement 詳細頁面
 */
'use client';

import { Button } from '@/components/ui/button';
import { EditEngagementForm, EngagementDetailView, EngagementProvider } from '@/features/core-operations/engagements';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react';

interface EngagementDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EngagementDetailPage({ params }: EngagementDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const isEditMode = searchParams.get('edit') === 'true';

  const handleBack = () => {
    router.push('/core-operations/engagements');
  };

  const handleEdit = (id: string) => {
    router.push(`/core-operations/engagements/${id}?edit=true`);
  };

  const handleDelete = (id: string) => {
    // TODO: 實現刪除確認對話框
    console.log('Delete engagement:', id);
    // 刪除成功後返回列表頁
    router.push('/core-operations/engagements');
  };

  const handleEditSuccess = () => {
    // 編輯成功後返回詳細頁面
    router.push(`/core-operations/engagements/${resolvedParams.id}`);
  };

  const handleEditCancel = () => {
    // 取消編輯返回詳細頁面
    router.push(`/core-operations/engagements/${resolvedParams.id}`);
  };

  return (
    <EngagementProvider>
      <div className="container mx-auto py-6">
        {isEditMode ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleEditCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <div>
                <h1 className="text-2xl font-bold">編輯專案合約</h1>
                <p className="text-muted-foreground">修改專案合約的相關信息</p>
              </div>
            </div>
            <EditEngagementForm
              engagementId={resolvedParams.id}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        ) : (
          <EngagementDetailView
            engagementId={resolvedParams.id}
            onBack={handleBack}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </EngagementProvider>
  );
}