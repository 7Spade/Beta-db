/**
 * @fileoverview 倉儲管理主頁
 * @description 倉儲管理的入口頁面，包含總覽、物料主檔、出入庫紀錄等功能
 */

export default function WarehousingPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">倉儲管理</h1>
          <p className="text-muted-foreground">
            管理物料庫存、出入庫紀錄和倉庫調撥
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">物料主檔</h3>
          <p className="text-sm text-muted-foreground">管理所有物料的基礎資訊</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">出入庫紀錄</h3>
          <p className="text-sm text-muted-foreground">追蹤物料的進出庫記錄</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">跨倉調撥</h3>
          <p className="text-sm text-muted-foreground">管理不同倉庫間的物料調撥</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">倉庫管理</h3>
          <p className="text-sm text-muted-foreground">管理倉庫基本資訊和配置</p>
        </div>
      </div>
    </div>
  );
}
