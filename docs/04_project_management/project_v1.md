# 專案管理 v1.0 - 現代化升級藍圖

## 1. 概述 (Overview)

本文件基於 `project.md` 的現有基礎，規劃下一階段的專案管理模組現代化升級。目標是解決目前架構中的核心痛點，引入更現代、更高效的技術實踐，以提升性能、使用者體驗和開發者體驗。

本次升級的核心思想是：**從「客戶端狀態管理」全面轉向「伺服器驅動 (Server-First)」的架構。**

## 2. 核心升級方向

### 2.1. 狀態管理與數據刷新機制重構

#### **現況痛點**

- **單一巨大 Context**: `ProjectContext.tsx` 在客戶端維護了所有專案的數據，任何微小的子任務更新都可能導致整個應用程式範圍的重新渲染，效能低下。
- **手動狀態同步**: 在 Context 中需要編寫複雜的遞迴邏輯來更新深層嵌套的任務狀態，這不僅容易出錯，也違反了「狀態應由伺服器驅動」的原則。
- **刷新不及時**: 使用者操作後，需要等待客戶端狀態更新，無法真正做到「即時」。

#### **v1.0 解決方案**

1.  **移除 `ProjectContext.tsx`**: 廢棄這個在客戶端維護全局狀態的模式。
2.  **全面採用 Server Actions**:
    - 將所有數據寫入操作（`addProject`, `addTask`, `updateTaskStatus` 等）從 Context 中移出，重構為獨立的 Server Actions。
    - 前端元件（如 `TaskItem`）的職責極大簡化：它們不再關心如何更新狀態，只需呼叫從 `'use server'` 檔案中匯入的異步函數。
3.  **使用 `revalidatePath` 實現即時刷新**:
    - 在每個 Server Action 成功更新資料庫後，只需在 Action 的末尾呼叫 `revalidatePath('/projects')` 或 `revalidateTag(...)`。
    - Next.js 將自動處理後續的一切：它會使相關頁面的快取失效，並在下一次渲染時從資料庫重新獲取最新數據，無縫地更新 UI。這才是最可靠、最高效的「即時刷新」。
4.  **引入樂觀更新 (Optimistic UI)**:
    - 為了極致的使用者體驗，在呼叫 Server Action 的同時，立即在 UI 上預先顯示操作結果。例如，使用者點擊「完成」時，UI 立刻將任務變為完成狀態。
    - 如果後端操作失敗，UI 會自動回滾。這可以透過 React 19 的 `useOptimistic` Hook 或 React 18 的 `useTransition` 實現。

---

### 2.2. 「任務委派與驗收」子系統

#### **現況痛點**

- **權責不清**: 一個任務只有 `assigneeId` 欄位，無法表達「委派」、「接受」、「請求驗收」等一系列複雜的協作狀態。
- **無法跨組織協作**: 現有設計很難將任務指派給外部的「合作夥伴 (Partner)」。

#### **v1.0 解決方案**

引入一個全新的「任務委派與驗收」子系統，將任務從一個靜態的待辦事項，轉化為一個動態的、可追蹤的協作契約。

1.  **資料庫擴展**:
    - 在 `Task` 物件中新增一個 `assignment` 物件，用以追蹤委派的完整生命週期（委派給誰、狀態、時間戳、歷史記錄等）。
    - **詳情**: 請參考獨立的設計文檔 `delegation-and-acceptance-system.md`。

2.  **建立工作流程 (Workflow)**:
    - **委派**: 專案經理可將任務指派給內部成員或外部夥伴。
    - **通知**: 透過事件驅動系統 (`events.md`) 自動向被委派方發送通知。
    - **接受/拒絕**: 被委派方可以接受或拒絕任務。
    - **回報與驗收**: 被委派方完成後提交驗收，委派方進行審核，形成閉環。

3.  **UI/UX 升級**:
    - 重構 `TaskItem` 元件，使其能根據使用者的角色和任務的委派狀態，動態顯示不同的操作按鈕。
    - 為所有使用者設計一個「我的任務中心」儀表板。

## 3. 預期效益

- **性能大幅提升**: 減少客戶端 JavaScript 負載，利用伺服器元件和串流渲染，加快頁面載入速度。
- **開發體驗簡化**: 移除複雜的客戶端狀態管理，讓開發者更專注於業務邏輯本身。
- **使用者體驗更佳**: 透過樂觀更新，讓應用操作感覺更即時、更流暢。
- **功能更強大**: 透過「委派與驗收」系統，平台將具備管理跨組織複雜協作的核心能力，商業價值顯著提升。

## 4. 相關文件

- **[任務委派與驗收設計藍圖](./delegation-and-acceptance-system.md)**
- **[事件驅動架構](../1-architecture/events.md)**
- **[資料庫設計](../1-architecture/database.md)**

### 結構樹 (Structure Tree)

```
src/
├── app/
│   └── (dashboard)/
│       └── projects/
│           └── page.tsx              # 將從伺服器端獲取數據，並傳遞給 views
├── components/
│   └── features/
│       └── projects/                 # 原 app 目錄
│           ├── actions/              <-- 新目錄，存放 Server Actions
│           │   ├── project.actions.ts
│           │   └── task-actions.ts
│           ├── components/             <-- 新目錄
│           │   ├── create-project-dialog.tsx
│           │   ├── project-details-sheet.tsx
│           │   └── task-item.tsx
│           ├── views/                <-- 新目錄
│           │   └── projects-view.tsx
│           └── types/                <-- 新目錄
│               └── project-types.ts
└── context/
    └── ProjectContext.tsx              <-- 廢棄並刪除此檔案

```
