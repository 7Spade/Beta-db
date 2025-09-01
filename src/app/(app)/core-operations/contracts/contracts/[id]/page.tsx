/**
 * @fileoverview 合約詳情頁面
 */
import { ContractDetailView } from '@/features/core-operations/contracts/views';

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ContractDetailView contractId={id} />
    </div>
  );
}
