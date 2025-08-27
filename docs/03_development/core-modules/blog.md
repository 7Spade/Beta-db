# 部落格功能檔案清單 (Blog Feature Files List)

本文件列出了 Beta-db 整合平台中所有與部落格系統相關的檔案。

## 📁 目錄結構

### 1. 後台管理元件 (Admin Components)
```
src/components/features/blog/
├── README.md                           # 部落格模組說明
├── actions/
│   └── posts.actions.ts                # 文章的 CRUD Server Actions (savePost, deletePost)
└── views/
    ├── posts-list-view.tsx             # 後台文章列表管理介面
    └── post-form-view.tsx              # 新增與編輯文章的表單介面
```

### 2. 後台管理頁面 (Admin Pages)
```
src/app/(admin)/blog-management/
└── posts/
    ├── page.tsx                        # 文章列表頁面
    └── [id]/
        └── page.tsx                    # 文章編輯/新增頁面
```

### 3. 公開頁面 (Public Pages)
```
src/app/(public)/blog/
├── page.tsx                            # 部落格文章列表頁 (公開)
└── [slug]/
    └── page.tsx                        # 單篇文章詳情頁 (公開)
```

### 4. 相關資料庫集合 (Related Collections)
- **`posts`**: 在 `docs/database.md` 中定義，用於儲存所有部落格文章的內容。

## 🔧 技術架構

- **後端**: Firebase Firestore (`posts` 集合)
- **前端框架**: Next.js (App Router)
- **資料操作**: Server Actions
- **表單管理**: `react-hook-form` + `zod`
- **UI 元件**: shadcn/ui

## 📊 核心功能

1.  **文章管理 (後台)**:
    - 管理員可以透過 `/admin/blog-management/posts` 頁面查看所有文章的列表。
    - 提供了「新增文章」、「編輯文章」和「刪除文章」的功能。
    - `post-form-view.tsx` 提供了完整的表單，包含標題、內容 (支援 Markdown)、Slug、狀態 (草稿、已發布、已封存) 等欄位。
    - 所有寫入操作（儲存、刪除）都透過 `posts.actions.ts` 中的 Server Actions 執行。

2.  **文章展示 (前台)**:
    - `/blog` 頁面公開展示所有「已發布」狀態的文章列表。
    - 點擊單篇文章會進入 `/blog/[slug]` 頁面，顯示文章的完整內容。
    - **注意**: 目前前台頁面使用的是模擬資料 (mock data)。若要實現動態載入，需要修改這兩個頁面，使其從 Firestore 的 `posts` 集合中獲取資料。

## 🚀 開發指南

- **修改文章欄位**:
  1.  在 `docs/database.md` 中更新 `posts` 集合的結構定義。
  2.  在 `src/components/features/blog/actions/posts.actions.ts` 的 `postSchema` 中更新 Zod 驗證規則。
  3.  在 `src/components/features/blog/views/post-form-view.tsx` 中新增或修改對應的表單欄位。

- **實現動態前台**:
  1.  修改 `src/app/(public)/blog/page.tsx`，使用 Firebase SDK 查詢所有 `status` 為「已發布」的文章並渲染列表。
  2.  修改 `src/app/(public)/blog/[slug]/page.tsx`，根據傳入的 `slug` 參數，查詢並渲染對應的單篇文章。

## 📚 相關文件

- [資料庫設計文件](../../02_architecture/database.md) (`posts` 集合)
- [後台管理導航配置](../../../config/navigation.config.ts) (`admin-blog-management`)
