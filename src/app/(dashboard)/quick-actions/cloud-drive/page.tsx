/**
 * @fileoverview Cloud Drive Page - 雲端硬碟功能的進入點
 * @description 此頁面負責渲染雲端硬碟的主視圖 (CloudDriveView)。
 */
import { CloudDriveView } from '@/components/features/cloud-drive/views/cloud-drive-view';
import { Suspense } from 'react';
import { Skeleton } from '@/ui/skeleton';

export default function CloudDrivePage() {
  return (
    <Suspense fallback={<Skeleton className="h-[calc(100vh-8rem)] w-full" />}>
      <CloudDriveView />
    </Suspense>
  );
}
