# 工地日報系統 - 設計藍圖

本文件詳細闡述了 Beta-db 整合平台中「工地日報」功能的系統設計、資料庫結構和未來開發的技術藍圖。

## 1. 核心目標 (Core Objectives)

工地日報是營造專案中每日進度、資源和現場狀況的關鍵記錄。本系統旨在：
- **數位化記錄**: 取代傳統的紙本或零散的電子表格，提供一個標準化、集中化的線上提報平台。
- **數據結構化**: 將日報中的資訊（如天氣、人力、物料消耗）變為可供分析的結構化數據。
- **歷史可追溯**: 方便專案經理和管理層隨時回溯查詢任何一天的工地狀況。
- **與專案整合**: 將每日的記錄與對應的「專案管理」模組緊密結合。

## 2. 功能規劃 (Feature Breakdown)

- **日報建立**:
  - 選擇對應的專案和日期。
  - 記錄天氣狀況（如：晴、陰、雨）和溫度。
  - 記錄當日出勤人力，可關聯到 `teamMembers` 集合，並記錄工時。
  - 記錄主要施工項目與進度描述（純文字或 Markdown）。
  - 記錄當日使用的主要材料和數量。
  - 上傳現場照片（可多張），照片將儲存在 Firebase Storage。
- **日報列表與檢視**:
  - 在特定專案的詳情頁中，以日曆或列表形式查看所有歷史日報。
  - 點擊後可查看單份日報的完整詳細資訊。
- **日報搜尋與篩選**:
  - 根據日期範圍進行篩選。
  - 根據關鍵字搜尋日報內容。
- **AI 輔助功能 (未來擴展)**:
  - **智慧摘要**: AI 自動從施工項目描述中生成當日工作摘要。
  - **異常警示**: AI 分析日報內容（如天氣與進度不匹配、人力異常等）並提出警示。

## 3. 資料庫設計 (Database Design)

我們將在 Firestore 中建立一個新的頂層集合：`daily_reports`。

### 集合: `daily_reports`

此集合儲存所有專案的每日報告。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位         | 類型                     | 描述                                                       |
|--------------|--------------------------|------------------------------------------------------------|
| `projectId`  | `string`                 | **[關聯]** 對應的 `projects` 集合的文件 ID。               |
| `reportDate` | `Timestamp`              | 報告對應的日期，用於查詢和排序。                           |
| `submittedBy`| `string`                 | **[關聯]** 提交該日報的使用者 `users` 文件 ID。            |
| `createdAt`  | `Timestamp`              | 該日報的建立時間。                                         |
| `weather`    | `Map`                    | 天氣狀況。例如：`{ condition: '晴', temperature: 28 }`     |
| `manpower`   | `Array<Map>`             | 當日出勤人力記錄。                                         |
| `workLog`    | `string`                 | 當日主要施工項目和進度描述，支援 Markdown。                |
| `materials`  | `Array<Map>`             | 當日物料使用記錄。                                         |
| `photos`     | `Array<Map>`             | 現場照片記錄。                                             |

#### 巢狀 `manpower` 物件結構

| 欄位         | 類型     | 描述                                       |
|--------------|----------|--------------------------------------------|
| `memberId`   | `string` | **[關聯]** 對應的 `teamMembers` 文件 ID。    |
| `memberName` | `string` | 成員姓名（冗餘儲存，方便顯示）。           |
| `hours`      | `number` | 當日工時。                                 |

#### 巢狀 `materials` 物件結構

| 欄位         | 類型     | 描述                                       |
|--------------|----------|--------------------------------------------|
| `itemId`     | `string` | **[關聯]** 對應的 `inventory_items` 文件 ID。|
| `itemName`   | `string` | 物料名稱（冗餘儲存，方便顯示）。           |
| `quantity`   | `number` | 消耗數量。                                 |
| `unit`       | `string` | 單位（如：噸、立方米、個）。               |

#### 巢狀 `photos` 物件結構

| 欄位        | 類型     | 描述                                       |
|-------------|----------|--------------------------------------------|
| `storagePath` | `string` | 檔案在 Firebase Storage 中的儲存路徑。     |
| `caption`   | `string` | (可選) 照片說明。                          |

## 4. 前端架構與路由 (Frontend Architecture)

- **新頁面路由**:
  - `/app/(dashboard)/projects/[id]/reports`: 顯示特定專案的所有日報列表。
  - `/app/(dashboard)/projects/[id]/reports/new`: 建立新日報的頁面。
  - `/app/(dashboard)/projects/[id]/reports/[reportId]`: 查看特定日報的詳情。
- **新元件目錄**: `src/components/features/daily-reports/`
  - `views/daily-report-list-view.tsx`: 日報列表主視圖。
  - `forms/daily-report-form.tsx`: 日報填寫表單。
  - `components/photo-uploader.tsx`: 專用於上傳現場照片的元件。

## 5. 整合點 (Integration Points)

- **專案管理**: 日報將作為一個新的標籤頁出現在專案詳情中。
- **團隊管理**: 在記錄人力時，需要讀取 `teamMembers` 集合的資料。
- **庫存系統**: 在記錄物料消耗時，需要讀取 `inventory_items` 的資料，並在未來可能觸發庫存更新。
- **雲端硬碟**: 上傳的照片將儲存在 Firebase Storage，並由 `cloud-drive` 模組統一管理。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       └── projects/
│           └── [id]/
│               ├── reports/              <-- 新路由
│               │   ├── [reportId]/
│               │   │   └── page.tsx
│               │   ├── new/
│               │   │   └── page.tsx
│               │   └── page.tsx
│               └── layout.tsx              <-- 修改現有佈局以包含「日報」標籤頁
├── components/
│   └── features/
│       └── daily-reports/                <-- 新目錄
│           ├── actions/
│           │   └── report-actions.ts
│           ├── components/
│           │   └── photo-uploader.tsx
│           ├── forms/
│           │   └── daily-report-form.tsx
│           ├── types/
│           │   └── report-types.ts
│           └── views/
│               ├── report-list-view.tsx
│               └── report-detail-view.tsx
└── ai/
    └── flows/
        └── summarize-daily-report-flow.ts  <-- 新 AI 流程

```
