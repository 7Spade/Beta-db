/**
 * @fileoverview 合約詳情頁面
 */
'use client';

import { ContractDetailView } from '@/components/features/contracts/views';
import { useRouter } from 'next/navigation';

interface ContractDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContractDetailPage({ params }: ContractDetailPageProps) {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ContractDetailView contractId={params.id} router={router} />
    </div>
  );
}
