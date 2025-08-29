/**
 * @fileoverview 跨倉調撥頁面
 * @description 管理不同倉庫間的物料調撥和庫存轉移
 */

export default function InventoryTransfersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">跨倉調撥</h1>
          <p className="text-muted-foreground">
            管理不同倉庫間的物料調撥、庫存轉移和調撥單據
          </p>
        </div>
      </div>
      
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">跨倉調撥功能開發中</h3>
        <p className="text-sm text-muted-foreground mt-2">
          此功能將包含調撥申請、調撥單據、庫存轉移記錄等管理功能
        </p>
      </div>
    </div>
  );
}
