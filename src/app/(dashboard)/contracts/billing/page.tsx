/**
 * @fileoverview 計價作業頁面
 * @description 管理合約的計價作業、付款追蹤和變更單
 */

export default function BillingPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">計價作業</h1>
          <p className="text-muted-foreground">
            管理合約的計價作業、付款追蹤和變更單處理
          </p>
        </div>
      </div>
      
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">計價作業功能開發中</h3>
        <p className="text-sm text-muted-foreground mt-2">
          此功能將包含計價單管理、付款追蹤、變更單處理等計價相關功能
        </p>
      </div>
    </div>
  );
}
