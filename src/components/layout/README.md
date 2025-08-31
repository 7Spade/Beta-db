# 佈局元件 (Layout Components)

此目錄負責應用程式的**整體佈局結構**和**核心導航系統**。這些元件定義了應用程式的「外殼」，為所有頁面提供一致的框架。

## 目錄結構與職責

- **`core/`**: **核心佈局元件**。這是佈局系統的心臟，包含：
  - `app-shell.tsx`: 組合側邊欄和主內容區域的頂層外殼。
  - `app-header.tsx`: 應用程式的頂部導航欄。
  - `app-provider.tsx`: 集中管理所有全域 Context Provider（如 Theme, Project, Sidebar 狀態）。

- **`navigation/`**: **導航相關元件**。包含所有用於使用者在應用程式中導航的元件，例如：
  - `unified-sidebar.tsx`: 統一的側邊欄，動態生成導航項目。
  - `breadcrumb.tsx`: 頁面路徑麵包屑。
  - `user-menu.tsx`: 使用者選單下拉列表。
  - `notification-center.tsx`: 通知中心。

- **`overlays/`**: **覆蓋層元件**。提供如對話方塊 (`Modal`)、抽屜 (`Drawer`)、彈出框 (`Popover`) 等覆蓋在主內容之上的 UI 元素。

- **`responsive/`**: **響應式設計輔助元件**。包含 `MobileMenu` 等專為適應不同螢幕尺寸而設計的元件。

- **`shared/`**: **共享的、通用的佈局元件**。這些是可以在應用程式各處重複使用的原子級佈局元件，例如 `PageHeader`, `EmptyState` 等。