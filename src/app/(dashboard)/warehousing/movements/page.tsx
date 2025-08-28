/**
 * @fileoverview 出入庫紀錄頁面
 * @description 追蹤物料的進出庫記錄和庫存變動
 */

export default function InventoryMovementsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">出入庫紀錄</h1>
          <p className="text-muted-foreground">
            追蹤物料的進出庫記錄、庫存變動和相關單據
          </p>
        </div>
      </div>
      
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">出入庫紀錄功能開發中</h3>
        <p className="text-sm text-muted-foreground mt-2">
          此功能將包含入庫單、出庫單、庫存調整單等記錄的查詢和管理
        </p>
      </div>
    </div>
  );
}
