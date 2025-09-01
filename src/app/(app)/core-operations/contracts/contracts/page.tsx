/**
 * @fileoverview 合約主頁
 * @description 合約管理的入口頁面，包含儀表板、列表和操作功能
 */

import { ContractsView } from '@/features/core-operations/contracts/views';

export default function ContractsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">合約管理</h1>
          <p className="text-muted-foreground">
            管理所有營造合約、付款追蹤和變更單
          </p>
        </div>
      </div>
      <ContractsView />
    </div>
  );
}
