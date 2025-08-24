/**
 * @project Beta-db Integrated Platform - 統一整合平台儀表板頁面
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 * 
 * @fileoverview Dashboard 模組主頁面 - 專案管理儀表板和統計概覽
 * @description 提供專案統計、任務完成度分析、即將到期的專案提醒，以及各專案的進度圖表展示。
 * 整合了專案管理數據，提供全面的分析視圖和關鍵績效指標 (KPI) 展示。
 */

'use client';

import { AiUsageLog } from '@/components/features/dashboard/ai-usage-log';
import { ContractDashboard } from '@/components/features/contracts/dashboard';
import { Dashboard as PartnerDashboard } from '@/components/features/partnerverse/dashboard/dashboard';
import { Separator } from '@/components/ui/separator';

export function DashboardView() {

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">合約總覽</h2>
        <ContractDashboard />
      </section>
      
      <Separator />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">合作夥伴總覽</h2>
        <PartnerDashboard />
      </section>

      <Separator />

       <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">AI 使用紀錄</h2>
        <AiUsageLog />
      </section>
    </div>
  );
}
