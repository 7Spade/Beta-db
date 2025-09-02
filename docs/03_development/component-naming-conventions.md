# 元件命名規範 (Component Naming Conventions)

## 📋 概述

本文件定義了 Beta-db 專案中 React 元件的命名規範，基於 Next.js 和 shadcn/ui 最佳實踐。

## 🎯 核心原則

### **元件命名規則**
- **元件名稱**：使用 `PascalCase`
- **元件檔案**：使用 `kebab-case.tsx`
- **元件資料夾**：使用 `kebab-case/`
- **元件內部變數**：使用 `camelCase`
- **例外**：`src/components/ui/` 目錄保持 shadcn/ui 官方結構不變

## 🧩 元件命名規範

### **1. 基本元件命名**

```typescript
// ✅ 正確的元件命名
// 檔案：button.tsx
export function Button() {
  return <button>按鈕</button>;
}

// 檔案：input.tsx
export function Input() {
  return <input />;
}

// 檔案：modal.tsx
export function Modal() {
  return <div>模態框</div>;
}
```

### **2. 複合元件命名**

```typescript
// ✅ 正確的複合元件命名
// 檔案：contract-form.tsx
export function ContractForm() {
  const [formData, setFormData] = useState<ContractFormData>({});
  
  const handleSubmit = (data: ContractFormData) => {
    // 處理邏輯
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表單內容 */}
    </form>
  );
}

// 檔案：contract-status-badge.tsx
export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {status}
    </span>
  );
}

// 檔案：blog-card.tsx
export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p>{blog.excerpt}</p>
    </div>
  );
}
```

### **3. 元件資料夾結構**

```typescript
// ✅ 正確的元件資料夾結構
src/components/ui/
├── button/
│   ├── index.tsx                 // 主要元件
│   ├── button.types.ts           // 類型定義
│   ├── button.utils.ts           // 工具函數
│   └── button.stories.tsx        // Storybook 故事
├── input/
│   ├── index.tsx
│   ├── input.types.ts
│   └── input.utils.ts
└── modal/
    ├── index.tsx
    ├── modal.types.ts
    └── modal.utils.ts
```

### **4. 功能模組元件**

```typescript
// ✅ 正確的功能模組元件命名
src/features/core-operations/contracts/
├── contract-form.tsx             // 合約表單
├── contract-list.tsx             // 合約列表
├── contract-status-badge.tsx     // 合約狀態徽章
├── contract-scope-item.tsx       // 合約範圍項目
└── contract-details.tsx          // 合約詳情

// ✅ 功能模組元件資料夾結構
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

## 🔧 元件內部命名規範

### **1. 狀態變數命名**

```typescript
// ✅ 正確的狀態變數命名
export function ContractForm() {
  // 使用 camelCase
  const [formData, setFormData] = useState<ContractFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  return (
    <form>
      {/* 表單內容 */}
    </form>
  );
}
```

### **2. 事件處理函數命名**

```typescript
// ✅ 正確的事件處理函數命名
export function ContractForm() {
  // 使用 handle 前綴
  const handleSubmit = (data: ContractFormData) => {
    // 處理提交邏輯
  };
  
  const handleInputChange = (field: string, value: string) => {
    // 處理輸入變更
  };
  
  const handleStatusChange = (status: ContractStatus) => {
    // 處理狀態變更
  };
  
  const handleDelete = (id: string) => {
    // 處理刪除邏輯
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表單內容 */}
    </form>
  );
}
```

### **3. 自定義 Hook 命名**

```typescript
// ✅ 正確的自定義 Hook 命名
// 檔案：use-contract.ts
export function useContract(contractId: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchContract = async () => {
    // 獲取合約邏輯
  };
  
  const updateContract = async (data: UpdateContractData) => {
    // 更新合約邏輯
  };
  
  return {
    contract,
    isLoading,
    error,
    fetchContract,
    updateContract,
  };
}

// 檔案：use-blog-list.ts
export function useBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchBlogs = async () => {
    // 獲取部落格列表邏輯
  };
  
  return {
    blogs,
    isLoading,
    fetchBlogs,
  };
}
```

## 🎨 樣式類別命名

### **1. CSS 類別命名**

```typescript
// ✅ 正確的 CSS 類別命名
export function ContractCard() {
  return (
    <div className="contract-card">
      <div className="contract-card__header">
        <h3 className="contract-card__title">合約標題</h3>
        <span className="contract-card__status">狀態</span>
      </div>
      <div className="contract-card__content">
        <p className="contract-card__description">合約描述</p>
      </div>
      <div className="contract-card__actions">
        <button className="contract-card__button contract-card__button--primary">
          編輯
        </button>
        <button className="contract-card__button contract-card__button--secondary">
          刪除
        </button>
      </div>
    </div>
  );
}
```

### **2. Tailwind CSS 類別命名**

```typescript
// ✅ 正確的 Tailwind CSS 類別命名
export function BlogCard() {
  return (
    <div className="blog-card rounded-lg border bg-card p-6 shadow-sm">
      <div className="blog-card__header mb-4">
        <h3 className="blog-card__title text-lg font-semibold">
          部落格標題
        </h3>
        <span className="blog-card__date text-sm text-muted-foreground">
          發布日期
        </span>
      </div>
      <div className="blog-card__content">
        <p className="blog-card__excerpt text-muted-foreground">
          部落格摘要
        </p>
      </div>
    </div>
  );
}
```

## 🔄 元件重構指南

### **需要重構的元件**

1. **檔案重命名**：
   - `ContractScopeItem.tsx` → `contract-scope-item.tsx`
   - `ContractScopeList.tsx` → `contract-scope-list.tsx`
   - `ContractStatusBadge.tsx` → `contract-status-badge.tsx`

2. **資料夾重命名**：
   - `BlogCard/` → `blog-card/`
   - `BlogEditor/` → `blog-editor/`
   - `BlogList/` → `blog-list/`

3. **元件名稱保持 PascalCase**：
   - 元件名稱：`ContractScopeItem`
   - 檔案名稱：`contract-scope-item.tsx`

### **重構步驟**

1. **重命名檔案**
   ```bash
   # 重命名檔案
   mv ContractScopeItem.tsx contract-scope-item.tsx
   mv ContractScopeList.tsx contract-scope-list.tsx
   ```

2. **更新 import 路徑**
   ```typescript
   // 更新前
   import { ContractScopeItem } from './ContractScopeItem';
   
   // 更新後
   import { ContractScopeItem } from './contract-scope-item';
   ```

3. **更新元件資料夾結構**
   ```typescript
   // 更新前
   src/features/website-cms/blog/BlogCard/
   
   // 更新後
   src/features/website-cms/blog/blog-card/
   ```

## 📚 參考資源

- [React 元件命名慣例](https://react.dev/learn/your-first-component#naming-components)
- [shadcn/ui 元件命名慣例](https://ui.shadcn.com/docs/components)
- [Next.js 元件最佳實踐](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [TypeScript 元件類型定義](https://typescript-eslint.io/rules/naming-convention/)

## ✅ 檢查清單

- [ ] 所有元件名稱使用 `PascalCase`
- [ ] 所有元件檔案使用 `kebab-case.tsx`
- [ ] 所有元件資料夾使用 `kebab-case/`
- [ ] 所有狀態變數使用 `camelCase`
- [ ] 所有事件處理函數使用 `handle` 前綴
- [ ] 所有自定義 Hook 使用 `use` 前綴
- [ ] 所有 CSS 類別使用 BEM 命名法
- [ ] 所有 import 路徑正確更新
- [ ] 所有文檔更新
- [ ] 所有測試通過

---

**注意**：本規範將持續更新，以反映最新的 React 和 Next.js 最佳實踐。
