
# 「職涯管理」系統 - 設計藍圖

本文件詳細闡述了如何將後台的「職涯管理」功能與前台的「企業徵才」頁面進行深度整合，從而建立一個動態的、由後台驅動的招聘系統。

## 1. 核心目標 (Core Objectives)

- **即時更新**: 讓 HR 或管理員能夠在後台即時發布新的職位空缺、更新職位資訊或關閉已招滿的職位，並立即同步到前台頁面。
- **集中管理應徵者**: 提供一個統一的介面，用於接收和管理所有來自前台的應徵申請，取代分散的郵件或表單。
- **提升招聘效率**: 將職位發布、應徵者管理、篩選流程整合在一起，簡化招聘工作流程。
- **改善應徵者體驗**: 為應徵者提供一個清晰、專業的介面來查看職缺和提交申請。

## 2. 功能規劃 (Feature Breakdown)

- **後台功能 (`/admin/career-management`)**:
  - **職位管理 (`/jobs`)**:
    - 提供一個列表，展示所有已建立的職位空缺，包含狀態（如：開放中、已關閉、草稿）。
    - 允許管理員建立、編輯、複製或刪除職位，欄位包含：職位名稱、地點、類型（全職/兼職）、薪資範圍、職務描述、需求條件等。
  - **應徵者管理 (`/applications`)**:
    - 集中顯示所有應徵者的申請記錄。
    - 每一筆記錄應包含應徵者基本資訊、應徵的職位、履歷檔案連結、申請時間和當前狀態（如：待審查、面試中、已錄取、未錄取）。
    - 提供篩選和搜尋功能。
- **前台顯示與互動 (`/careers`)**:
  - **職缺列表頁**: 自動從資料庫查詢所有**狀態為「開放中」**的職位，並清晰地展示出來。
  - **線上應徵**: 在每個職缺旁提供一個「立即應徵」按鈕，點擊後彈出一個表單，讓應徵者填寫基本資料並上傳履歷。提交後，資料會被寫入後台的「應徵者」資料庫。

## 3. 資料庫設計影響 (Database Design Impact)

為實現此功能，需要建立兩個新的頂層集合：`job_postings` 和 `job_applications`。

### 集合 1: `job_postings`
此集合儲存所有職位空缺的資訊。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位        | 類型      | 描述                                                       |
|-------------|-----------|------------------------------------------------------------|
| `title`     | `string`  | 職位名稱。                                                 |
| `status`    | `string`  | **[查詢關鍵]** '開放中', '已關閉', '草稿'。前台只顯示「開放中」。 |
| `location`  | `string`  | 工作地點。                                                 |
| `type`      | `string`  | 職位類型（如：'全職', '兼職', '實習'）。                  |
| `salaryRange`|`string`  | 薪資範圍的文字描述。                                       |
| `description`| `string` | 職務的詳細描述。                                           |
| `requirements`| `string`| 應徵者的需求條件。                                         |
| `createdAt` | `Timestamp`| 職位建立時間。                                           |

### 集合 2: `job_applications`
此集合儲存所有收到的應徵申請。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位         | 類型      | 描述                                       |
|--------------|-----------|--------------------------------------------|
| `jobId`      | `string`  | **[關聯]** 對應的 `job_postings` 文件 ID。 |
| `jobTitle`   | `string`  | 應徵的職位名稱（冗餘儲存，方便顯示）。     |
| `applicantName`| `string` | 應徵者姓名。                               |
| `applicantEmail`| `string`| 應徵者電子郵件。                           |
| `applicantPhone`| `string`| 應徵者電話。                               |
| `resumeUrl`  | `string`  | 履歷檔案在 Firebase Storage 中的儲存 URL。 |
| `coverLetter`| `string`  | (可選) 求職信內容。                         |
| `status`     | `string`  | 申請狀態（如：'待審查', '面試中'）。     |
| `submittedAt`| `Timestamp`| 申請提交時間。                             |


## 4. 前端架構影響 (Frontend Architecture Impact)

### 後台
- 現有的 `/app/(admin)/career-management/**` 結構已建立良好基礎，需將其元件與新的 Firestore 集合連接。

### 前台
- `/app/(public)/careers/page.tsx` 需要從**靜態數據**改為**動態從 `job_postings` 集合獲取數據**。
- 需要新增一個「應徵表單」元件（可以是 Dialog 或新頁面），並建立對應的 Server Action 將應徵資料寫入 `job_applications` 集合。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   ├── (admin)/
│   │   └── career-management/
│   │       ├── jobs/page.tsx       <-- **重構**: 連接到 `job_postings` 集合
│   │       └── applications/page.tsx <-- **重構**: 連接到 `job_applications` 集合
│   └── (public)/
│       └── careers/
│           └── page.tsx              <-- **重構**: 從 `job_postings` 獲取數據
└── components/
    └── features/
        ├── careers/                    <-- **新目錄** (或放在 public/ 下)
        │   ├── apply-form-dialog.tsx   # 線上應徵的表單對話框
        │   └── actions/
        │       └── application-actions.ts # 提交應徵申請的 Server Action
        └── admin/
            └── career-management/        <-- **重構**
                ├── job-form.tsx          # 建立/編輯職位的表單
                └── application-viewer.tsx # 查看單一申請的介面
```

---
**結論**: 將職涯管理系統動態化，不僅能大幅提升 HR 的工作效率，也能向潛在的人才展現公司的專業形象，是提升企業雇主品牌的重要一步。
