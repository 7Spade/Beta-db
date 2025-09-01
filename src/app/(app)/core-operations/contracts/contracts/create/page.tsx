/**
 * @fileoverview 創建合約頁面
 */

import { CreateContractView } from '@/features/core-operations/contracts/views/create-contract-view';

export default function CreateContractPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">建立新合約</h1>
          <p className="text-muted-foreground">
            填寫合約資訊以建立新的營造合約
          </p>
        </div>
      </div>
      <CreateContractView />
    </div>
  );
}
