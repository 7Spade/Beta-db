/**
 * @fileoverview Engagement 詳細頁面
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EngagementProvider } from '@/features/core-operations/engagements';
import { EngagementDetailView, EditEngagementForm } from '@/features/core-operations/engagements';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EngagementDetailPageProps {
  params: {
    id: string;
  };
}

export default function EngagementDetailPage({ params }: EngagementDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    router.push(`/core-operations/engagements/${params.id}`);
  };

  const handleEditCancel = () => {
    // 取消編輯返回詳細頁面
    router.push(`/core-operations/engagements/${params.id}`);
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
              engagementId={params.id}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        ) : (
          <EngagementDetailView
            engagementId={params.id}
            onBack={handleBack}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </EngagementProvider>
  );
}