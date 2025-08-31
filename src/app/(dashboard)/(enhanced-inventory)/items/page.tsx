/**
 * @fileoverview 物料主檔管理頁面
 * @description 管理所有物料的基礎資訊、規格和庫存
 */

export default function InventoryItemsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">物料主檔</h1>
          <p className="text-muted-foreground">
            管理所有物料的基礎資訊、規格和庫存數量
          </p>
        </div>
      </div>
      
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">物料主檔功能開發中</h3>
        <p className="text-sm text-muted-foreground mt-2">
          此功能將包含物料的增刪改查、規格管理、庫存追蹤等功能
        </p>
      </div>
    </div>
  );
}
