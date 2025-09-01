# 後台管理模組 (Admin Module)

## 概述

此模組負責提供整個應用程式的管理功能，主要面向具有 `Admin` 角色的使用者。它包含的功能對於維護系統的正常運作和使用者社群至關重要。

## 架構設計

### 目錄結構

```
admin/
├── actions/      # 存放與管理功能相關的 Server Actions
│   └── user-actions.ts
└── views/        # 包含構成管理頁面的主要 React 元件
    ├── admin-dashboard-view.tsx
    └── user-view.tsx
```

### 核心功能

- **儀表板 (`admin-dashboard-view.tsx`)**: 顯示系統概覽和關鍵指標，作為管理員的入口頁面。
- **使用者管理 (`user-view.tsx`)**: 核心功能之一，用於審核新註冊的使用者，批准或拒絕其訪問申請。

## 使用方式

`views/` 中的元件被用作 `app/(admin)/` 路由群組下各個頁面的主要內容。Server Actions 則由這些 `view` 元件直接呼叫，以執行後端操作。

```tsx
// src/app/(admin)/user/page.tsx
import { UserManagementView } from '@/features/admin/views/user-view';

export default function UserManagementPage() {
  return <UserManagementView />;
}
```
