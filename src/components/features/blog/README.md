# 部落格模組 (Blog Module)

## 概述

此模組負責管理所有與部落格相關的功能，包括後台的文章管理和前台的文章展示。

## 架構設計

### 目錄結構

```
blog/
├── actions/                  # Server Actions
├── views/                    # 頁面視圖組件
│   ├── posts-list-view.tsx     # 後台文章列表
│   └── post-form-view.tsx      # 後台文章表單
├── components/               # 可重用組件 (例如 PostCard)
├── services/                 # 業務邏輯服務 (如果需要)
└── types/                    # 類型定義
```

### 核心功能

- **文章管理**: 建立、編輯、刪除、發布文章
- **文章展示**: 公開的部落格列表和文章詳情頁面
- **分類和標籤**: (未來擴展)

## 使用方式

### 後台頁面
在 `/app/(admin)/blog/` 路由下的頁面中，導入 `views` 中的後台元件。

```tsx
// src/app/(admin)/blog/posts/page.tsx
import { PostsListView } from '@/components/features/blog/views/posts-list-view';

export default function AdminBlogPostsPage() {
  return <PostsListView />;
}
```

### 前台頁面
在 `/app/(public)/blog/` 路由下的頁面中，導入 `views` 中的前台元件。
