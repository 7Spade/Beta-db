# 倉儲管理模組 (Warehousing Module)

## 概述

此模組負責所有與「倉儲管理」相關的前端元件和業務邏輯。它將涵蓋多倉庫管理、物料主檔、庫存水平追蹤以及物料的出入庫與調撥。

**此模組的資料儲存已全面遷移至 Supabase (PostgreSQL)。**

## 核心架構

本模組採用高度整合的設計，以提供流暢的使用者體驗：

- **`views/warehousing-view.tsx`**: 作為唯一的模組入口和主視圖，使用標籤頁 (Tabs) 來組織所有功能，包括總覽、倉庫管理、物料管理等。
- **`views/warehousing-dashboard-view.tsx`**: 顯示倉儲相關的統計數據和總覽，被主視圖引用。
- **`components/*`**: 存放由主視圖渲染的、功能內聚的大型列表元件 (例如: `warehouse-list.tsx`, `item-list.tsx`)。
- **`forms/*`**: 存放所有用於新增和編輯操作的對話方塊表單。
- **`actions/warehousing-actions.ts`**: 包含所有與後端 (Supabase) 互動的 Server Actions。
