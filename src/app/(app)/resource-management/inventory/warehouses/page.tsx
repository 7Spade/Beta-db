/**
 * @fileoverview 倉庫管理頁面
 * @description 管理倉庫基本資訊、配置和庫位管理
 */

export default function WarehousesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">倉庫管理</h1>
          <p className="text-muted-foreground">
            管理倉庫基本資訊、配置、庫位和相關設定
          </p>
        </div>
      </div>
      
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">倉庫管理功能開發中</h3>
        <p className="text-sm text-muted-foreground mt-2">
          此功能將包含倉庫資訊管理、庫位配置、倉庫設定等功能
        </p>
      </div>
    </div>
  );
}
