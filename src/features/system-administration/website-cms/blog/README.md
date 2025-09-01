# 部落格模組 (Blog Module)

## 概述

此模組負責管理所有與部落格相關的功能，涵蓋了從後台的文章管理到前台的文章展示。

## 架構設計

### 目錄結構

```
blog/
├── actions/                  # 存放與文章相關的 Server Actions (儲存、刪除)
│   └── posts.actions.ts
└── views/                    # 構成部落格頁面的主要 React 元件
    ├── posts-list-view.tsx     # 後台：文章列表與管理介面
    └── post-form-view.tsx      # 後台：新增與編輯文章的表單介面
```

### 核心功能

- **文章管理 (後台)**: 提供給管理員建立、編輯、發布、封存和刪除文章的功能。
- **文章展示 (前台)**: 在 `/blog` 公開頁面中，以列表形式展示已發布的文章，並提供單篇文章的詳情頁面。

## 使用方式

### 後台頁面
在 `/app/(admin)/blog/` 路由群組下的頁面中，導入 `views/` 中的後台元件。

```tsx
// src/app/(admin)/blog/posts/page.tsx
import { PostsListView } from '@/features/blog/views/posts-list-view';

export default function AdminBlogPostsPage() {
  return <PostsListView />;
}
```

### 前台頁面
前台的部落格頁面 (`/app/(public)/blog/`) 目前是靜態的。未來可以重構為從 Firestore 動態獲取 `posts` 集合的資料來渲染。
