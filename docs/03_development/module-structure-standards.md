# 模組結構標準 (Module Structure Standards)

## 📋 概述

本文件定義了 Beta-db 專案中所有功能模組的統一子目錄結構標準，確保代碼組織的一致性和可維護性。

## 🎯 核心原則

### **統一模組結構**
- 所有功能模組必須遵循相同的子目錄結構
- 每個子目錄都有明確的職責和用途
- 使用 `index.ts` 檔案進行統一導出

## 📁 標準模組結構

### **完整結構模板**

```typescript
// ✅ 標準模組結構
src/features/[module-name]/
├── actions/                    // Server Actions
│   ├── index.ts               // 統一導出
│   └── [module]-actions.ts    // 主要 Actions
├── components/                 // 可重用元件
│   ├── index.ts               // 統一導出
│   └── [component-name].tsx   // 元件檔案
├── constants/                  // 模組常數
│   ├── index.ts               // 統一導出
│   └── [module]-constants.ts  // 常數定義
├── dashboard/                  // 儀表板元件
│   ├── index.ts               // 統一導出
│   └── [module]-dashboard.tsx // 儀表板元件
├── dialogs/                    // 對話框元件
│   ├── index.ts               // 統一導出
│   └── [dialog-name].tsx      // 對話框元件
├── forms/                      // 表單元件
│   ├── index.ts               // 統一導出
│   └── [form-name].tsx        // 表單元件
├── hooks/                      // 自定義 Hooks
│   ├── index.ts               // 統一導出
│   └── use-[hook-name].ts     // Hook 檔案
├── providers/                  // Context Providers
│   ├── index.ts               // 統一導出
│   └── [module]-provider.tsx  // Provider 元件
├── services/                   // 服務層
│   ├── index.ts               // 統一導出
│   └── [module].service.ts    // 服務檔案
├── sheets/                     // 側邊欄元件
│   ├── index.ts               // 統一導出
│   └── [sheet-name].tsx       // Sheet 元件
├── tables/                     // 表格元件
│   ├── index.ts               // 統一導出
│   └── [table-name].tsx       // 表格元件
├── types/                      // 類型定義
│   ├── index.ts               // 統一導出
│   ├── [module].types.ts      // 主要類型
│   └── [specific].types.ts    // 特定類型
├── utils/                      // 工具函數
│   ├── index.ts               // 統一導出
│   ├── [module].utils.ts      // 主要工具
│   └── [specific].utils.ts    // 特定工具
└── views/                      // 頁面視圖
    ├── index.ts               // 統一導出
    └── [view-name].tsx        // 視圖元件
```

## 📂 子目錄詳細說明

### **1. actions/ - Server Actions**
```typescript
// 用途：存放 Next.js Server Actions
// 命名：kebab-case
// 範例：
src/features/core-operations/contracts/actions/
├── index.ts
└── contract-actions.ts
```

### **2. components/ - 可重用元件**
```typescript
// 用途：存放模組內可重用的元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/components/
├── index.ts
├── contract-card.tsx
├── contract-status-badge.tsx
└── contract-scope-item.tsx
```

### **3. constants/ - 模組常數**
```typescript
// 用途：存放模組相關的常數定義
// 命名：kebab-case.ts
// 範例：
src/features/core-operations/contracts/constants/
├── index.ts
└── contract-constants.ts
```

### **4. dashboard/ - 儀表板元件**
```typescript
// 用途：存放儀表板相關的元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/dashboard/
├── index.ts
└── contract-dashboard.tsx
```

### **5. dialogs/ - 對話框元件**
```typescript
// 用途：存放模態對話框元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/dialogs/
├── index.ts
├── contract-delete-dialog.tsx
└── contract-edit-dialog.tsx
```

### **6. forms/ - 表單元件**
```typescript
// 用途：存放表單相關元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/forms/
├── index.ts
├── contract-form.tsx
└── contract-search-form.tsx
```

### **7. hooks/ - 自定義 Hooks**
```typescript
// 用途：存放自定義 React Hooks
// 命名：use-kebab-case.ts
// 範例：
src/features/core-operations/contracts/hooks/
├── index.ts
├── use-contract.ts
└── use-contract-list.ts
```

### **8. providers/ - Context Providers**
```typescript
// 用途：存放 React Context Providers
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/providers/
├── index.ts
└── contract-provider.tsx
```

### **9. services/ - 服務層**
```typescript
// 用途：存放業務邏輯和 API 調用
// 命名：kebab-case.service.ts
// 範例：
src/features/core-operations/contracts/services/
├── index.ts
└── contract.service.ts
```

### **10. sheets/ - 側邊欄元件**
```typescript
// 用途：存放側邊欄元件（如 shadcn/ui Sheet）
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/sheets/
├── index.ts
└── contract-details-sheet.tsx
```

### **11. tables/ - 表格元件**
```typescript
// 用途：存放表格相關元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/tables/
├── index.ts
└── contract-table.tsx
```

### **12. types/ - 類型定義**
```typescript
// 用途：存放 TypeScript 類型定義
// 命名：kebab-case.types.ts
// 範例：
src/features/core-operations/contracts/types/
├── index.ts
├── contract.types.ts
└── contract-form.types.ts
```

### **13. utils/ - 工具函數**
```typescript
// 用途：存放工具函數和輔助方法
// 命名：kebab-case.utils.ts
// 範例：
src/features/core-operations/contracts/utils/
├── index.ts
├── contract.utils.ts
└── contract-validation.utils.ts
```

### **14. views/ - 頁面視圖**
```typescript
// 用途：存放頁面級別的視圖元件
// 命名：kebab-case.tsx
// 範例：
src/features/core-operations/contracts/views/
├── index.ts
├── contract-list-view.tsx
└── contract-detail-view.tsx
```

## 🔧 index.ts 統一導出規範

### **標準導出格式**

```typescript
// ✅ 標準 index.ts 格式
// src/features/[module-name]/[subdirectory]/index.ts

// 導出所有元件
export { ContractCard } from './contract-card';
export { ContractStatusBadge } from './contract-status-badge';
export { ContractScopeItem } from './contract-scope-item';

// 導出類型
export type { ContractCardProps } from './contract-card';
export type { ContractStatus } from './contract-status-badge';

// 導出常數
export { CONTRACT_STATUSES } from './contract-constants';
```

## 📋 實際應用範例

### **合約模組完整結構**

```typescript
// ✅ 合約模組完整結構
src/features/core-operations/contracts/
├── actions/
│   ├── index.ts
│   └── contract-actions.ts
├── components/
│   ├── index.ts
│   ├── contract-card.tsx
│   ├── contract-status-badge.tsx
│   └── contract-scope-item.tsx
├── constants/
│   ├── index.ts
│   └── contract-constants.ts
├── dashboard/
│   ├── index.ts
│   └── contract-dashboard.tsx
├── dialogs/
│   ├── index.ts
│   ├── contract-delete-dialog.tsx
│   └── contract-edit-dialog.tsx
├── forms/
│   ├── index.ts
│   ├── contract-form.tsx
│   └── contract-search-form.tsx
├── hooks/
│   ├── index.ts
│   ├── use-contract.ts
│   └── use-contract-list.ts
├── providers/
│   ├── index.ts
│   └── contract-provider.tsx
├── services/
│   ├── index.ts
│   └── contract.service.ts
├── sheets/
│   ├── index.ts
│   └── contract-details-sheet.tsx
├── tables/
│   ├── index.ts
│   └── contract-table.tsx
├── types/
│   ├── index.ts
│   ├── contract.types.ts
│   └── contract-form.types.ts
├── utils/
│   ├── index.ts
│   ├── contract.utils.ts
│   └── contract-validation.utils.ts
└── views/
    ├── index.ts
    ├── contract-list-view.tsx
    └── contract-detail-view.tsx
```

### **部落格模組完整結構**

```typescript
// ✅ 部落格模組完整結構
src/features/website-cms/blog/
├── actions/
│   ├── index.ts
│   └── blog-actions.ts
├── components/
│   ├── index.ts
│   ├── blog-card.tsx
│   ├── blog-meta.tsx
│   └── blog-tags.tsx
├── constants/
│   ├── index.ts
│   └── blog-constants.ts
├── dashboard/
│   ├── index.ts
│   └── blog-dashboard.tsx
├── dialogs/
│   ├── index.ts
│   ├── blog-delete-dialog.tsx
│   └── blog-publish-dialog.tsx
├── forms/
│   ├── index.ts
│   ├── blog-form.tsx
│   └── blog-search-form.tsx
├── hooks/
│   ├── index.ts
│   ├── use-blog.ts
│   └── use-blog-list.ts
├── providers/
│   ├── index.ts
│   └── blog-provider.tsx
├── services/
│   ├── index.ts
│   └── blog.service.ts
├── sheets/
│   ├── index.ts
│   └── blog-preview-sheet.tsx
├── tables/
│   ├── index.ts
│   └── blog-table.tsx
├── types/
│   ├── index.ts
│   ├── blog.types.ts
│   └── blog-form.types.ts
├── utils/
│   ├── index.ts
│   ├── blog.utils.ts
│   └── blog-validation.utils.ts
└── views/
    ├── index.ts
    ├── blog-list-view.tsx
    └── blog-editor-view.tsx
```

## 🔄 重構指南

### **現有模組重構步驟**

1. **創建標準子目錄結構**
   ```bash
   mkdir -p src/features/[module-name]/{actions,components,constants,dashboard,dialogs,forms,hooks,providers,services,sheets,tables,types,utils,views}
   ```

2. **移動現有檔案到對應目錄**
   ```bash
   # 移動元件檔案
   mv src/features/[module-name]/*.tsx src/features/[module-name]/components/
   
   # 移動類型檔案
   mv src/features/[module-name]/*.types.ts src/features/[module-name]/types/
   
   # 移動工具檔案
   mv src/features/[module-name]/*.utils.ts src/features/[module-name]/utils/
   ```

3. **創建 index.ts 檔案**
   ```typescript
   // 為每個子目錄創建 index.ts 檔案
   // 統一導出該目錄下的所有內容
   ```

4. **更新 import 路徑**
   ```typescript
   // 更新所有相關的 import 語句
   // 使用新的目錄結構
   ```

## ✅ 檢查清單

- [ ] 所有模組遵循標準子目錄結構
- [ ] 每個子目錄都有 index.ts 檔案
- [ ] 檔案命名使用 kebab-case
- [ ] 元件命名使用 PascalCase
- [ ] 所有 import 路徑正確更新
- [ ] 統一導出格式正確
- [ ] 文檔更新完成
- [ ] 測試通過

## 📚 參考資源

- [Next.js 檔案結構最佳實踐](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [React 元件組織最佳實踐](https://react.dev/learn/your-first-component#naming-components)
- [TypeScript 模組組織](https://typescript-eslint.io/rules/naming-convention/)

---

**注意**：本標準將持續更新，以反映最新的開發最佳實踐。
