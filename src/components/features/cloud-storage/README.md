# 雲端儲存 - 精簡主義設計

## 設計理念

本雲端儲存功能採用精簡主義設計原則，專注於：

- **統一性**: 使用單一 `StorageItem` 類型處理檔案和資料夾
- **簡潔性**: 減少重複代碼和複雜的狀態管理
- **一致性**: 統一的 UI 模式和用戶體驗
- **效能**: 優化的資料處理和渲染

## 架構概覽

```
src/components/features/cloud-storage/
├── types/
│   └── storage.types.ts          # 統一的類型定義
├── actions/
│   └── storage.actions.ts        # 精簡的 Server Actions
├── components/
│   ├── storage-item-card.tsx     # 統一的項目卡片
│   ├── file-browser.tsx          # 精簡的檔案瀏覽器
│   ├── upload-button.tsx         # 上傳按鈕
│   ├── rename-dialog.tsx         # 重命名對話框
│   └── create-folder-dialog.tsx  # 創建資料夾對話框
└── views/
    └── cloud-storage-view.tsx    # 主要視圖
```

## 核心改進

### 1. 統一類型系統
- 合併 `StorageFile` 和 `StorageFolder` 為 `StorageItem`
- 使用 `type` 欄位區分檔案和資料夾
- 統一的錯誤處理和結果類型

### 2. 精簡的 Actions
- 合併 `deleteFileAction` 和 `deleteFolderAction` 為 `deleteItemAction`
- 統一的 `renameItemAction` 處理檔案和資料夾
- 優化的資料排序和過濾

### 3. 統一的 UI 組件
- `StorageItemCard` 替代多個卡片組件
- 智能圖標系統根據檔案類型顯示
- 統一的右鍵選單和操作

### 4. 優化的狀態管理
- 單一 `items` 狀態管理所有項目
- 統一的載入和錯誤狀態
- 簡化的事件處理器

## 使用方式

```tsx
import { CloudStorageView } from '@/components/features/cloud-storage/views/cloud-storage-view';

export default function CloudStoragePage() {
  return <CloudStorageView />;
}
```

## 精簡主義特色

1. **減少組件數量**: 從 6 個組件減少到 5 個
2. **統一類型定義**: 從 2 個接口減少到 1 個
3. **簡化 Actions**: 從 5 個函數減少到 4 個
4. **優化狀態管理**: 從 2 個狀態減少到 1 個
5. **一致的用戶體驗**: 統一的卡片設計和操作流程

## 技術優勢

- **TypeScript**: 完整的類型安全
- **React Server Components**: 優化的伺服器端渲染
- **Tailwind CSS**: 一致的設計系統
- **Firebase Admin**: 安全的後端操作
- **Next.js**: 現代化的 React 框架

## 遵循 Firebase 最佳實踐

- 使用 `.folder` 標記檔案創建資料夾
- 安全的檔案名稱清理
- 適當的錯誤處理和用戶反饋
- 優化的資料查詢和分頁
- 安全的權限控制
