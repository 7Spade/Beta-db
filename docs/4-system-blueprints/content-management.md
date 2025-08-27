
# 「內容管理」系統 (CMS) - 設計藍圖

本文件詳細闡述了如何建立一個靈活的「無頭內容管理系統 (Headless CMS)」，讓後台的「內容管理」功能可以直接控制多個前台頁面的內容，例如「關於我們」、「服務條款」甚至是「首頁」的區塊。

## 1. 核心目標 (Core Objectives)

- **內容即數據**: 將頁面上的文字、圖片、連結等內容，從寫死在程式碼中的靜態元素，轉變為儲存在資料庫中的動態數據。
- **賦予非技術人員能力**: 讓行銷或營運人員能夠在不需開發者介入的情況下，直接從後台修改網站的文案和圖片。
- **快速迭代**: 當需要調整首頁的某個標語或「關於我們」的介紹時，可以即時完成，無需重新部署整個應用程式。
- **一致性與結構化**: 為不同類型的內容定義清晰的結構（Schema），確保內容的完整性和一致性。

## 2. 功能規劃 (Feature Breakdown)

- **後台功能 (`/admin/content-management`)**:
  - **內容模型定義 (未來擴充)**: 理想情況下，系統應允許管理員定義內容的「模型」或「類型」（例如：「首頁英雄區塊」、「團隊成員卡片」）。
  - **內容條目管理**:
    - 基於定義好的模型，建立和管理內容「條目 (Entries)」。
    - 例如，在「首頁英雄區塊」模型下，管理員可以編輯 `title`、`subtitle`、`buttonText` 和 `backgroundImageUrl` 這幾個欄位。
    - 提供一個清晰的列表，顯示所有可編輯的頁面或內容區塊。
- **前台顯示**:
  - 每個需要動態內容的頁面（如 `about/page.tsx`），在渲染前會先從資料庫查詢其對應的內容數據。
  - 將查詢到的數據（如 `title`, `description`）填充到頁面的 JSX 結構中。

## 3. 資料庫設計影響 (Database Design Impact)

實現此功能有多種方式，這裡提出一個靈活且可擴展的方案：建立一個 `structured_content` 集合。

### 集合: `structured_content`

此集合的設計思想是，每個「文件 (Document)」代表一個獨立的、可管理的內容區塊或頁面。

- **文件 ID**: 使用人類可讀的、有意義的 ID，例如 `home_page_hero` 或 `about_page_main`。
- **文件結構**: 每個文件的結構都是**動態的**，直接對應其內容模型的欄位。

#### 範例文件 1: (ID: `home_page_hero`)
```json
{
  "title": "領先的精密設備整合服務專家",
  "subtitle": "從前期評估、客製化設計到無塵室整合與持續維護...",
  "buttonText": "諮詢方案",
  "buttonLink": "/contact"
}
```

#### 範例文件 2: (ID: `about_page_mission`)
```json
{
  "title": "我們的使命",
  "description": "我們的使命是將複雜的營造專案管理流程簡化、數據化、智能化...",
  "imageUrl": "https://placehold.co/600x400.png"
}
```

## 4. 前端架構影響 (Frontend Architecture Impact)

### 後台
- `/app/(admin)/content-management/page.tsx` 需要提供一個介面，列出所有可編輯的內容條目（即 `structured_content` 集合中的所有文件）。
- 點擊某個條目後，應動態生成一個表單，讓管理員可以編輯該文件的所有欄位。

### 前台
- 所有需要動態內容的頁面（如 `src/app/(public)/page.tsx`）都需要被**重構為異步的伺服器元件 `async function Page()`**。
- 在元件的開頭，它會先去 `structured_content` 集合查詢其需要的內容文件（例如，查詢 ID 為 `home_page_hero` 的文件）。
- 然後將獲取到的數據傳遞給 JSX 進行渲染。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   ├── (admin)/
│   │   └── content-management/
│   │       ├── page.tsx            <-- **重構**: 列出所有可編輯的內容條目
│   │       └── [id]/
│   │           └── page.tsx          <-- **新路由**: 動態生成內容編輯表單
│   └── (public)/
│       ├── page.tsx                  <-- **重構**: 從 Firestore 獲取首頁內容
│       ├── about/page.tsx            <-- **重構**: 從 Firestore 獲取關於我們頁面內容
│       ├── privacy-policy/page.tsx   <-- **重構**: 從 Firestore 獲取隱私權政策內容
│       └── terms-of-service/page.tsx <-- **重構**: 從 Firestore 獲取服務條款內容
└── components/
    └── features/
        └── content/                    <-- **新目錄**
            ├── actions/
            │   └── content-actions.ts  # 更新內容的 Server Actions
            └── views/
                └── content-editor-view.tsx # 後台動態內容編輯器的主元件
```

---
**結論**: 建立一個無頭 CMS 是平台走向成熟的重要標誌。它將內容的創建與技術實現分離，極大地提升了網站內容的靈活性和營運效率，是實現敏捷行銷和快速回應市場變化的基礎。
