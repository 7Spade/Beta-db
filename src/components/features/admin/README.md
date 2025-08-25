# 後台管理模組 (Admin Module)

## 概述

此模組負責提供整個應用程式的管理功能，例如用戶管理、權限設定、系統日誌等。

## 架構設計

### 目錄結構

```
admin/
├── views/            # 頁面視圖組件
├── components/       # 可重用組件
├── services/         # 業務邏輯服務
└── types/            # 類型定義
```

### 核心功能

- **儀表板**: 顯示系統概覽和關鍵指標
- **用戶管理**: 管理用戶帳戶和權限
- **系統設定**: 配置應用程式的全域設定
- **日誌查看**: 檢視系統和錯誤日誌

## 使用方式

在 `/app/(admin)/` 路由群組下的頁面中，直接導入 `views` 中的元件。

```tsx
// src/app/(admin)/dashboard/page.tsx
import { AdminDashboardView } from '@/components/features/admin/views/admin-dashboard-view';

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
```
