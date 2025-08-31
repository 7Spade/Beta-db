# 「資源與排程」整合系統 - 設計藍圖

本文件詳細闡述了 Beta-db 整合平台中，如何將「內部團隊」與「專案管理」模組進行深度整合，打造一個視覺化、智慧化的資源與排程系統。

## 1. 核心目標 (Core Objectives)

此系統旨在解決營造專案中「人、事、時」的匹配與協調問題，核心目標包括：
- **資源視覺化**: 提供一個集中的視覺化介面，讓管理者能一目了然地知道「在什麼時間，誰在哪個專案工作」。
- **排程效率化**: 簡化將團隊成員指派到特定專案和任務的流程，取代傳統的口頭或電子表格排班。
- **避免資源衝突**: 透過視覺化工具，提前發現並解決人力資源分配上的衝突。
- **智慧化輔助**: 引入 AI 技術，在排班時提供決策輔助，提高資源配置的合理性。

## 2. 功能規劃 (Feature Breakdown)

### 階段一：基礎視覺化排班日曆 (MVP)
- **位置**: `/app/(dashboard)/team/schedule` 頁面。
- **功能**:
    - 實現一個**視覺化的排班日曆**（可按月、週、日檢視）。
    - 管理者可以**手動**從「同伴列表 (`teamMembers`)」中選擇成員。
    - 將選定的成員**指派 (Assign)** 到特定日期的特定「專案 (`projects`)」。
    - 在日曆上清晰地顯示每個成員在哪一天被分配到哪個專案。
    - 提供基礎的篩選功能，例如按特定專案或特定成員進行篩選。
- **效益**: 解決最基本的「誰在哪裡」的問題，提供一個統一的資訊看板。

### 階段二：與任務的深度整合
- **功能擴展**:
    - 在指派時，不僅能選擇專案，還能進一步**選擇該專案下的具體任務**（如「一樓牆面砌磚」）。
    - 在「專案詳情」頁面的任務列表旁，可以直接看到該任務被指派了哪些成員和日期。
    - 在「同伴列表」中，可以查看每個成員未來的排班情況。

### 階段三：智慧排班建議 (AI-Assisted Scheduling)
- **目標**: 這不是全自動 AI 排班，而是提供強大的「輔助決策工具」。
- **功能**:
    - 當管理者要為一個需要特定技能（如「模板工」、「鋼筋工」）的任務進行排班時，可以啟用「AI 建議」功能。
    - 系統會觸發一個新的 Genkit AI 流程，該流程：
        1. 讀取任務所需的技能（此為新功能，需在任務上增加 `requiredSkills` 欄位）。
        2. 查詢 `teamMembers` 集合，篩選出擁有這些 `skills` 的成員。
        3. 檢查這些合適成員在目標排班日期是否已有其他排班。
        4. 將「技能匹配」且「時間有空」的成員列表，作為建議結果返回給前端。
    - 前端以建議列表的形式呈現，讓管理者只需點選即可完成指派。
- **效益**: 大幅節省管理者翻閱資料、逐一詢問確認的時間，直接提供高品質的決策選項。

## 3. 資料庫設計影響 (Database Design Impact)

為實現此系統，需要對現有資料庫結構進行擴展或新增：

- **新增集合: `schedules`**:
  - 用於儲存所有的排班記錄，比直接寫入 `projects` 或 `teamMembers` 更具擴展性。
  - **文件結構**:
    - `id`: 自動生成 ID
    - `projectId`: `string` (關聯到 `projects`)
    - `taskId`: `string` (可選, 關聯到 `projects` 內的 `Task`)
    - `memberId`: `string` (關聯到 `teamMembers`)
    - `startDate`: `Timestamp`
    - `endDate`: `Timestamp`
    - `assignedBy`: `string` (指派工作的管理員 `users` ID)

- **擴展 `projects` 集合中的 `Task` 物件**:
  - 新增欄位 `requiredSkills`: `Array<string>`，用於記錄完成此任務所需的技能 ID 列表，這是 AI 建議功能的基礎。

## 4. 前端架構影響 (Frontend Architecture Impact)

- 需要引入或開發一個功能強大的**日曆元件**，作為排班視圖的基礎。
- 在 `/team/schedule` 頁面開發完整的排班互動邏輯（拖拽、點擊、指派等）。
- 需要開發新的 AI 流程 `suggest-schedule-members-flow.ts`。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       └── team/
│           └── schedule/
│               └── page.tsx
├── components/
│   └── features/
│       └── team/
│           └── schedule/               <-- 新目錄
│               ├── actions/
│               │   └── schedule-actions.ts
│               ├── components/
│               │   ├── schedule-calendar.tsx
│               │   └── assignment-dialog.tsx
│               ├── types/
│               │   └── schedule-types.ts
│               └── views/
│                   └── schedule-view.tsx
└── ai/
    └── flows/
        └── suggest-schedule-flow.ts      <-- 新 AI 流程

```

---
**結論**: 此系統將團隊管理與專案執行緊密結合，是從「靜態記錄」邁向「動態調度」的關鍵步驟，能顯著提升專案的資源管理效率。
