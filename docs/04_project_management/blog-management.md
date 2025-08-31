
# 「文章管理」系統 - 設計藍圖

本文件詳細闡述了如何將後台的「文章管理」功能與前台的「部落格」頁面進行深度整合，從而建立一個動態的、內容驅動的部落格系統。

## 1. 核心目標 (Core Objectives)

- **動態內容**: 讓非技術背景的管理員能夠透過後台介面，輕鬆地發布、更新或下架文章，而無需修改任何程式碼。
- **內容與呈現分離**: 後台只負責管理「數據」（文章標題、內容、狀態），前台則專注於如何美觀地「呈現」這些數據。
- **SEO 優化**: 確保動態產生的文章頁面仍然對搜尋引擎友好，可以被正確索引。
- **提升使用者參與度**: 透過持續發布有價值的內容，吸引並留住訪客。

## 2. 功能規劃 (Feature Breakdown)

- **後台功能 (`/admin/blog-management`)**:
  - **文章列表**: 提供一個表格視圖，展示所有文章，並包含標題、狀態（草稿、已發布、已封存）、作者、發布日期等欄位，並提供篩選和搜尋功能。
  - **文章編輯器**:
    - 一個功能完整的表單，用於建立或編輯文章。
    - 欄位應包含：標題 (`title`)、內容 (`content`，支援 Markdown)、URL Slug (`slug`)、摘要 (`excerpt`)、主圖 URL (`imageUrl`)、狀態 (`status`)、作者 (`authorName`) 等。
    - **Slug 自動生成**: 當管理員輸入標題時，系統應能自動生成一個對 SEO 友好的 slug，但同時也允許手動修改。
- **前台顯示 (`/blog`)**:
  - **列表頁 (`/blog`)**: 自動查詢 `posts` 集合中所有 `status` 為「已發布」的文章，並以卡片形式分頁顯示。
  - **詳情頁 (`/blog/[slug]`)**: 根據 URL 中的 `slug` 參數，從 `posts` 集合中查詢對應的單篇文章並渲染其完整內容。

## 3. 資料庫設計影響 (Database Design Impact)

此功能完全依賴現有的 **`posts` 集合**。我們需要確保該集合的結構能夠滿足所有前台顯示的需求。

### 集合: `posts`

| 欄位         | 類型        | 備註                                        |
|--------------|-------------|---------------------------------------------|
| `title`      | `string`    | 文章標題。                                  |
| `slug`       | `string`    | **[查詢關鍵]** 用於 URL，必須是唯一的。     |
| `content`    | `string`    | 文章內容，支援 Markdown。                   |
| `excerpt`    | `string`    | (可選) 文章摘要，用於列表頁面顯示。         |
| `imageUrl`   | `string`    | (可選) 文章的主圖片 URL。                   |
| `status`     | `string`    | **[查詢關鍵]** ('已發布', '草稿', '已封存')。前台只查詢「已發布」的文章。 |
| `authorId`   | `string`    | 關聯到 `users` 的作者 ID。                  |
| `authorName` | `string`    | 作者姓名，用於顯示。                        |
| `publishedAt`| `Timestamp` | (可選) 文章的發布時間，可用於排序。       |
| `createdAt`  | `Timestamp` | 文章的建立時間。                            |
| `updatedAt`  | `Timestamp` | 文章的最後更新時間。                        |


## 4. 前端架構影響 (Frontend Architecture Impact)

### 後台
- 現有的 `/app/(admin)/blog-management/**` 結構已經很完善，主要工作是確保 `post-form-view.tsx` 和 `posts.actions.ts` 的功能完整。

### 前台
- 需要將 `/app/(public)/blog/**` 下的頁面從**靜態模擬數據**改為**動態數據獲取**。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (public)/
│       └── blog/
│           ├── page.tsx          <-- **重構**: 從 Firestore 獲取已發布文章列表
│           └── [slug]/
│               └── page.tsx      <-- **重構**: 根據 slug 從 Firestore 獲取單篇文章
└── components/
    └── features/
        └── blog/
            ├── actions/
            │   └── posts.actions.ts  # Server Actions 已存在
            └── views/
                ├── post-form-view.tsx  # 後台表單已存在
                └── posts-list-view.tsx # 後台列表已存在
```

---
**結論**: 這個系統是實現內容行銷和資訊發布的基礎。透過將後台與前台數據打通，平台將擁有獨立發布內容的能力，這對於品牌建立和客戶溝通至關重要。
