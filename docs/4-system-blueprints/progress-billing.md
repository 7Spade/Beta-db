# 「進度計價與審批」整合系統 - 設計藍圖

本文件旨在詳細闡述 Beta-db 整合平台中，如何將「專案管理」、「合約管理」與「合作夥伴 (PartnerVerse)」三大模組深度整合，打造一個自動化、透明化的進度計價與審批系統。

## 1. 核心目標 (Core Objectives)

此系統的核心目標是解決營造業在分期計價和請款審批流程中最核心的痛點，實現：
- **數據連動**: 將專案的實際工程進度與合約的付款條件直接掛鉤。
- **流程自動化**: 當滿足計價條件時，系統能自動或半自動地生成「計價單 (Billing Request)」。
- **審批透明化**: 將傳統的線下審批流程（口頭、紙本、Email）轉移到線上，每一步都有跡可循。
- **減少爭議**: 讓每一筆請款都有明確的、不可否認的數據作為依據，減少甲乙雙方的溝通成本與爭議。

## 2. 功能規劃 (Feature Breakdown)

### 階段一：進階合約付款排程 (Advanced Payment Schedule)
- **位置**: 「合約詳情」頁面。
- **功能**:
    - 允許使用者（如專案經理或財務）將合約總價拆分為多個**付款期數 (Payment Milestones)**。
    - 每一期可以設定不同的觸發條件：
        - **依日期 (Date-based)**: 如 `2025-10-01`。
        - **依進度百分比 (Percentage-based)**: 如專案總進度達到 `50%`。
        - **依特定任務完成 (Task-based)**: 如 `專案A` 的 `一樓結構體完成` 任務被標記為「已完成」。
    - 為每一期設定預計請款金額、預計日期和備註。
- **效益**: 將模糊的合約付款條件，轉化為系統中清晰、可追蹤的結構化數據。

### 階段二：計價單系統 (Billing Request System)
- **位置**: 可作為「合約詳情」頁或一個新的「計價中心」頁面的功能。
- **功能**:
    - **發起計價**: 當專案進度達到付款排程中設定的條件時，系統**提示**相關人員可以發起一筆新的計價。或者，使用者也可以手動發起計價。
    - **關聯已完成工作**: 系統引導使用者選擇本次計價要包含的**已驗收完成的任務**（數據來源於「任務委派與驗收」系統中，`assignment.status` 為 `'Completed'` 的任務）。
    - **產生計價單**: 系統根據所選任務，自動產生一張標準化的「計價單」，詳列本次完成的項目、數量、單價、金額，並與合約中的工料清單對應。這張計價單將作為一個獨立的實體被儲存。
- **效益**: 告別 Excel！讓每一筆請款都有實際的工程進度作為依據，減少人為計算錯誤和爭議。

### 階段三：多層審批流程 (Multi-level Approval Workflow)
- **位置**: 深度整合 `PartnerVerse` 模組。
- **功能**:
    - 當「計價單」被送出後，系統會自動在 `PartnerVerse` 中為對應的下游包商（夥伴）建立一筆「應付款單據 (`financial_documents`)」。
    - 該單據會嚴格依照預先為此夥伴設定好的 `payableWorkflow`（應付審批流程，例如：工地主任確認 -> 專案經理覆核 -> 財務部批准）進行流轉。
    - 在流程的每一步，對應的審批人員都會收到系統通知。
    - 審批人員可以在系統中直接**批准**、**退回**，並可**加註意見**。
    - 所有審批的操作、時間和意見都會被記錄在該單據的 `history` 欄位和全域的 `activity_logs` 中。
- **效益**: 實現請款流程的完全透明化與無紙化，大幅提升內部審批效率，並保留完整的數位軌跡以供未來稽核。

## 3. 資料庫設計影響 (Database Design Impact)

為實現此系統，需要對現有資料庫結構進行擴展及新增。

### 新增集合: `billing_requests`
此集合用於儲存所有產生的計價單。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| `contractId` | `string` | **[關聯]** 對應的 `contracts` 集合 ID。 |
| `projectId` | `string` | **[關聯]** 對應的 `projects` 集合 ID。 |
| `requestDate` | `Timestamp` | 計價單的申請日期。 |
| `status` | `'Draft'` \| `'PendingApproval'` \| `'Approved'` \| `'Rejected'` \| `'Paid'` | 計價單的當前狀態。 |
| `totalAmount` | `number` | 此計價單的總金額。 |
| `linkedTaskIds`| `Array<string>` | **核心欄位**。記錄了此計價單包含的所有**已完成任務**的 ID。 |
| `approvalHistory`| `Array<Map>` | 記錄審批流程中的每一步操作。 |

### 擴展 `contracts` 集合
- 新增一個欄位 `paymentSchedule` (`Array<Map>`)，用於儲存階段一中定義的付款排程。每個 Map 物件包含 `conditionType`, `conditionValue`, `amount`, `estimatedDate` 等。

## 4. 前端架構影響 (Frontend Architecture Impact)

- 需要在「合約詳情」頁面開發新的 UI 來設定 `paymentSchedule`。
- 需要開發一個新的「計價單產生器」介面，讓使用者可以勾選已完成的任務來產生計價單。
- 需要增強 `PartnerVerse` 中財務單據的顯示，使其能清晰地展示審批歷史和目前狀態。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       ├── billing/                      <-- 新路由
│       │   ├── page.tsx                  # 計價中心儀表板
│       │   └── create/
│       │       └── page.tsx              # 新建計價單
│       └── contracts/
│           └── [id]/
│               └── page.tsx              <-- 在此頁面加入設定付款排程的 UI
├── components/
│   └── features/
│       ├── billing/                      <-- 新目錄
│       │   ├── actions/
│       │   │   └── billing-actions.ts
│       │   ├── components/
│       │   │   ├── payment-schedule-editor.tsx
│       │   │   └── task-selector-for-billing.tsx
│       │   ├── views/
│       │   │   ├── billing-dashboard-view.tsx
│       │   │   └── create-bill-view.tsx
│       │   └── types/
│       │       └── billing-types.ts
│       └── partnerverse/
│           └── workflows/
│               └── workflow-builder.tsx    <-- 增強此元件以顯示審批細節
└── lib/
    └── events/
        └── app-events.ts                 <-- 新增 'billing.created', 'billing.approved' 等事件

```

---
**結論**: 此整合系統是連接工程與財務的橋樑，是平台從「數據記錄」走向「流程自動化」的關鍵一步，具有極高的業務價值。
