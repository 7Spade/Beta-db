import { DashboardView } from '@root/src/features/(business-intelligence)/(reporting-analytics)/dashboard/dashboard-view';

// 防止在 build/export 階段進行預先產生，避免觸發 DB 連線
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardView />;
}
