# 檔案命名規範 (File Naming Conventions)

## 📋 概述

本文件詳細定義了 Beta-db 專案中所有檔案和資料夾的命名規範，基於 Next.js 和 shadcn/ui 最佳實踐。

## 🎯 核心原則

### **統一使用 kebab-case**
- 所有檔案和資料夾名稱使用 `kebab-case`（小寫字母 + 連字符）
- 例外：
  - React 元件名稱使用 `PascalCase`，但檔案名稱仍使用 `kebab-case`
  - `src/components/ui/` 目錄保持 shadcn/ui 官方結構不變

## 📁 檔案類型命名規範

### **1. 統一模組子目錄結構**

所有功能模組必須遵循以下統一的子目錄結構：

```typescript
// ✅ 標準模組結構
src/features/[module-name]/
├── actions/                    // Server Actions
│   ├── index.ts
│   └── [module]-actions.ts
├── components/                 // 可重用元件
│   ├── index.ts
│   └── [component-name].tsx
├── constants/                  // 模組常數
│   ├── index.ts
│   └── [module]-constants.ts
├── dashboard/                  // 儀表板元件
│   ├── index.ts
│   └── [module]-dashboard.tsx
├── dialogs/                    // 對話框元件
│   ├── index.ts
│   └── [dialog-name].tsx
├── forms/                      // 表單元件
│   ├── index.ts
│   └── [form-name].tsx
├── hooks/                      // 自定義 Hooks
│   ├── index.ts
│   └── use-[hook-name].ts
├── providers/                  // Context Providers
│   ├── index.ts
│   └── [module]-provider.tsx
├── services/                   // 服務層
│   ├── index.ts
│   └── [module].service.ts
├── sheets/                     // 側邊欄元件
│   ├── index.ts
│   └── [sheet-name].tsx
├── tables/                     // 表格元件
│   ├── index.ts
│   └── [table-name].tsx
├── types/                      // 類型定義
│   ├── index.ts
│   └── [module].types.ts
├── utils/                      // 工具函數
│   ├── index.ts
│   └── [module].utils.ts
└── views/                      // 頁面視圖
    ├── index.ts
    └── [view-name].tsx
```

### **2. React 元件檔案**

#### **shadcn/ui 官方元件 (保持不變)**
```typescript
// ✅ shadcn/ui 官方結構 (不重構)
src/components/ui/
├── button.tsx                    // shadcn/ui 官方元件
├── input.tsx                     // shadcn/ui 官方元件
├── card.tsx                      // shadcn/ui 官方元件
├── dialog.tsx                    // shadcn/ui 官方元件
├── sheet.tsx                     // shadcn/ui 官方元件
└── table.tsx                     // shadcn/ui 官方元件
```

#### **自定義元件檔案**
```typescript
// ✅ 自定義元件檔案命名
src/components/layout/
├── header.tsx                    // 自定義元件
├── sidebar.tsx                   // 自定義元件
├── footer.tsx                    // 自定義元件
└── navigation.tsx                // 自定義元件

// ✅ 自定義元件資料夾結構
src/components/layout/
├── header/
│   ├── index.tsx                 // 主要元件
│   ├── header.types.ts           // 類型定義
│   ├── header.utils.ts           // 工具函數
│   └── header.stories.tsx        // Storybook 故事
└── navigation/
    ├── index.tsx
    ├── navigation.types.ts
    └── navigation.utils.ts
```

### **2. 頁面檔案 (App Router)**

```typescript
// ✅ 正確的頁面檔案命名
src/app/
├── (app)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── core-operations/
│   │   ├── contracts/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   └── projects/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   └── resource-management/
│       ├── crm/
│       │   └── page.tsx
│       └── hr/
│           └── page.tsx
└── (public)/
    ├── about/
    │   └── page.tsx
    ├── blog/
    │   ├── page.tsx
    │   └── [slug]/
    │       └── page.tsx
    └── contact/
        └── page.tsx
```

### **3. 功能模組檔案**

```typescript
// ✅ 正確的功能模組檔案命名
src/features/core-operations/contracts/
├── contract-actions.ts           // Server Actions
├── contract-types.ts             // 類型定義
├── contract-utils.ts             // 工具函數
├── contract-form.tsx             // 表單元件
├── contract-list.tsx             // 列表元件
├── contract-status-badge.tsx     // 狀態徽章元件
└── contract-scope-item.tsx       // 範圍項目元件

// ✅ 功能模組資料夾結構
src/features/website-cms/blog/
├── blog-card/
│   ├── index.tsx
│   ├── blog-card.types.ts
│   └── blog-card.utils.ts
├── blog-editor/
│   ├── index.tsx
│   ├── blog-editor.types.ts
│   └── blog-editor.utils.ts
└── blog-list/
    ├── index.tsx
    ├── blog-list.types.ts
    └── blog-list.utils.ts
```

### **4. 服務和工具檔案**

```typescript
// ✅ 正確的服務檔案命名
src/shared/services/
├── auth.service.ts               // 認證服務
├── contract.service.ts           // 合約服務
├── project.service.ts            // 專案服務
├── user.service.ts               // 用戶服務
└── notification.service.ts       // 通知服務

// ✅ 正確的工具檔案命名
src/shared/utils/
├── date.utils.ts                 // 日期工具
├── format.utils.ts               // 格式化工具
├── validation.utils.ts           // 驗證工具
└── api.utils.ts                  // API 工具
```

### **5. API 相關檔案**

```typescript
// ✅ 正確的 API 檔案命名
src/api/
├── client/
│   ├── core/
│   │   ├── auth.client.ts        // 認證客戶端
│   │   ├── contract.client.ts    // 合約客戶端
│   │   └── project.client.ts     // 專案客戶端
│   └── hooks/
│       ├── use-auth.ts           // 認證 Hook
│       ├── use-contract.ts       // 合約 Hook
│       └── use-project.ts        // 專案 Hook
└── server/
    ├── handlers/
    │   ├── auth.handler.ts       // 認證處理器
    │   ├── contract.handler.ts   // 合約處理器
    │   └── project.handler.ts    // 專案處理器
    └── validators/
        ├── auth.validator.ts     // 認證驗證器
        ├── contract.validator.ts // 合約驗證器
        └── project.validator.ts  // 專案驗證器
```

### **6. 類型定義檔案**

```typescript
// ✅ 正確的類型檔案命名
src/shared/types/
├── common.types.ts               // 通用類型
├── api.types.ts                  // API 類型
└── database.types.ts             // 資料庫類型

// ✅ 功能模組類型檔案
src/features/core-operations/contracts/
├── contract.types.ts             // 合約類型
├── contract-form.types.ts        // 合約表單類型
└── contract-list.types.ts        // 合約列表類型
```

### **7. 常數和配置檔案**

```typescript
// ✅ 正確的常數檔案命名
src/shared/constants/
├── api.constants.ts              // API 常數
├── theme.constants.ts            // 主題常數
└── validation.constants.ts       // 驗證常數

// ✅ 正確的配置檔案命名
src/shared/config/
├── auth.config.ts                // 認證配置
├── database.config.ts            // 資料庫配置
└── app.config.ts                 // 應用配置
```

## ❌ 錯誤的命名範例

### **常見錯誤**

```typescript
// ❌ 錯誤的檔案命名
src/features/core-operations/contracts/
├── ContractScopeItem.tsx         // ❌ 應該使用 kebab-case
├── ContractScopeList.tsx         // ❌ 應該使用 kebab-case
├── contractStatusBadge.tsx       // ❌ 應該使用 kebab-case
├── contract_actions.ts           // ❌ 應該使用 kebab-case
└── contractActions.ts            // ❌ 應該使用 kebab-case

// ❌ 錯誤的資料夾命名
src/features/website-cms/blog/
├── BlogCard/                     // ❌ 應該使用 kebab-case
├── BlogEditor/                   // ❌ 應該使用 kebab-case
├── BlogList/                     // ❌ 應該使用 kebab-case
└── blogCard/                     // ❌ 應該使用 kebab-case

// ❌ 錯誤的服務檔案命名
src/shared/services/
├── authService.ts                // ❌ 應該使用 kebab-case
├── contractService.ts            // ❌ 應該使用 kebab-case
├── projectService.ts             // ❌ 應該使用 kebab-case
└── user_service.ts               // ❌ 應該使用 kebab-case
```

## 🔄 重構指南

### **重構範圍**

#### **需要重構的目錄**
- `src/features/` - 所有功能模組
- `src/components/layout/` - 自定義佈局元件
- `src/shared/` - 共享資源
- `src/api/` - API 相關檔案

#### **保持不變的目錄**
- `src/components/ui/` - shadcn/ui 官方元件結構
- `src/app/` - Next.js App Router 結構

### **重構步驟**

1. **識別需要重構的檔案**
   - 使用 `PascalCase` 的檔案
   - 使用 `camelCase` 的檔案
   - 使用 `snake_case` 的檔案

2. **重命名檔案**
   - 將所有檔案重命名為 `kebab-case`
   - 保持元件名稱使用 `PascalCase`
   - **不重構** `src/components/ui/` 目錄

3. **更新 import 路徑**
   - 更新所有相關的 import 語句
   - 確保路徑正確

4. **更新文檔**
   - 更新 README 檔案
   - 更新開發文檔

5. **執行測試**
   - 確保所有測試通過
   - 驗證功能正常

### **重構工具**

```bash
# 使用 VS Code 的重構功能
# 1. 右鍵點擊檔案 → Rename
# 2. 選擇 "Rename Symbol" 來更新所有引用

# 使用命令行工具
find src -name "*.tsx" -o -name "*.ts" | grep -E "[A-Z]" | head -10
```

## 📚 參考資源

- [Next.js 檔案命名慣例](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [shadcn/ui 元件命名慣例](https://ui.shadcn.com/docs/components)
- [TypeScript 命名慣例](https://typescript-eslint.io/rules/naming-convention/)
- [React 元件命名慣例](https://react.dev/learn/your-first-component#naming-components)

## ✅ 檢查清單

### **檔案命名檢查**
- [ ] 所有檔案使用 `kebab-case` 命名
- [ ] 所有資料夾使用 `kebab-case` 命名
- [ ] 元件名稱使用 `PascalCase`
- [ ] 類型檔案使用 `.types.ts` 後綴
- [ ] 工具檔案使用 `.utils.ts` 後綴
- [ ] 服務檔案使用 `.service.ts` 後綴

### **例外檢查**
- [ ] `src/components/ui/` 目錄保持 shadcn/ui 官方結構不變
- [ ] `src/app/` 目錄保持 Next.js App Router 結構不變

### **重構完成檢查**
- [ ] 所有 import 路徑正確更新
- [ ] 所有文檔更新
- [ ] 所有測試通過

---

**注意**：本規範將持續更新，以反映最新的 Next.js 和 shadcn/ui 最佳實踐。
