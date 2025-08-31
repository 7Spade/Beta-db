# 雲端硬碟功能檔案清單 (Cloud Drive Feature Files List)

本文件列出了 Beta-db 整合平台中所有與雲端硬碟檔案管理功能相關的檔案。此功能是「智慧文件解析」的前置步驟。

## 📁 目錄結構

### 1. 核心功能元件 (Core Feature Components)
```
src/features/cloud-drive/
├── README.md                           # 雲端硬碟模組概述
├── actions/
│   └── storage-actions.ts              # 所有與 Firebase Storage 互動的 Server Actions
├── components/
│   ├── file-browser.tsx                # 檔案與資料夾的網格視圖
│   ├── file-card.tsx                   # 單一檔案的卡片元件
│   ├── folder-card.tsx                 # 單一資料夾的卡片元件
│   └── upload-button.tsx               # 處理檔案上傳的按鈕元件
├── types/
│   └── storage.types.ts                # 模組專用的 TypeScript 類型 (StorageItem 等)
├── utils/
│   └── path.utils.ts                   # 路徑處理相關的工具函數
└── views/
    └── cloud-drive-view.tsx            # 整個功能的主視圖與狀態管理中心
```

### 2. 頁面入口 (Page Entry)
```
src/app/(dashboard)/cloud-drive/
└── page.tsx                            # 雲端硬碟頁面
```

### 3. 相關服務與設定 (Related Services & Config)
```
src/lib/db/firebase-admin/firebase-admin.ts   # 初始化 Firebase Admin SDK (包含 Storage)
src/lib/db/firebase-client/firebase-client.ts # 初始化 Firebase Client SDK (包含 Storage)
firebase.json                               # Firebase 專案設定，定義儲存桶規則 (storage.rules)
```

## 🔧 技術架構

- **核心服務**: Firebase Storage for Cloud
- **後端操作**: Server Actions (`storage-actions.ts`)，使用 `firebase-admin` SDK。
- **前端框架**: Next.js (App Router)
- **UI 元件**: shadcn/ui

## 📊 核心功能

1.  **檔案與資料夾瀏覽**:
    - `cloud-drive-view.tsx` 作為主容器，呼叫 `listItems` Server Action 來獲取指定路徑下的內容。
    - `file-browser.tsx` 負責將獲取到的 `items` 陣列渲染成網格視圖，並根據 `item.type` 決定使用 `FileCard` 或 `FolderCard`。

2.  **導航**:
    - `cloud-drive-view.tsx` 根據 URL 中的 `path` 查詢參數來生成麵包屑導航。
    - 點擊資料夾 (`FolderCard`) 或麵包屑連結會觸發 `useRouter` 來更新 URL，從而重新觸發數據獲取。

3.  **檔案操作**:
    - **上傳**: `UploadButton` 元件觸發隱藏的 `<input type="file">`。選擇檔案後，它會建立一個 `FormData` 物件並呼叫 `uploadFile` Server Action。
    - **建立資料夾**: `cloud-drive-view.tsx` 中的對話方塊獲取資料夾名稱，然後呼叫 `createFolder` Server Action。
    - **刪除**: `FileCard` 和 `FolderCard` 中的刪除選項會觸發 `cloud-drive-view.tsx` 中的確認對話方塊，確認後呼叫 `deleteItem` Server Action。
    - **下載/預覽**: `FileCard` 透過呼叫 `getSignedUrl` Server Action 來獲取一個有時效性的下載 URL，然後在新分頁中打開它。對於圖片，懸停時會預先獲取 URL 用於預覽。

4.  **與文件解析整合**:
    - 從 `cloud-drive` 的檔案列表中，可以選擇一個文件並跳轉至 `/docu-parse` 頁面。`FileCard` 透過 `router.push` 並將檔案路徑作為 URL 參數來實現這一點。

## 📚 相關文件

- [文件解析功能檔案清單](./docu-parse.md)
- [資料庫設計文件](../../02_architecture/database.md) (雖然主要使用 Storage，但與整體架構相關)
