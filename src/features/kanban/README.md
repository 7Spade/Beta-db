# 看板模組 (Kanban Module)

## 概述

此模組提供了一個功能完整的看板（Kanban Board）介面，用於視覺化地管理任務或任何工作流程。使用者可以透過拖放（Drag and Drop）的方式在不同的欄位之間移動卡片。

本模組的實作參考了 [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter)。

## 架構設計

- **`components/`**: 包含構成看板 UI 的核心元件，如 `KanbanBoard`、`KanbanColumn` 和 `KanbanCard`。
- **`data/`**: 提供用於展示和測試的模擬資料 (`tasks.ts`)。
- **`hooks/`**: `use-kanban.ts` 封裝了看板的核心邏輯，包括狀態管理和拖放後的資料處理。
- **`types/`**: 定義了看板所需的 TypeScript 類型，如 `Column`, `Task` 等。
- **`index.ts`**: 作為模組的統一導出入口。

## 使用方式

在需要使用看板的頁面中，導入 `KanbanView` 元件即可。

```tsx
import { KanbanView } from '@/features/kanban';

export default function KanbanPage() {
  return <KanbanView />;
}
```

未來可以將 `data/tasks.ts` 中的靜態資料替換為從 `ProjectContext` 或其他後端服務動態獲取的任務數據，以與專案管理功能深度整合。
