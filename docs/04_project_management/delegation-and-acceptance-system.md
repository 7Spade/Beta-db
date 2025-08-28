# 「任務委派與驗收」整合系統 - 設計藍圖

本文件旨在詳細闡述 Beta-db 整合平台中，如何設計並實作一個健壯的「任務委派與驗收」系統。此系統是平台從「單人記錄工具」轉型為「跨組織協作平台」的核心。

## 1. 核心目標 (Core Objectives)

直接在任務上增加一個 `assigneeId` 欄位是遠遠不夠的，因為它無法表達一個完整的協作生命週期。本系統的目標是：

- **定義清晰的協作流程**: 將任務的生命週期從簡單的「待辦/完成」擴展為包含「委派、接受、拒絕、回報、請求驗收、完成」的完整閉環。
- **明確權責**: 在任何時間點，任務的狀態和當前責任方（委派方或被委派方）都應清晰明確。
- **保留數位軌跡**: 每一個狀態的變更、每一次的溝通（如退回原因）都應被記錄下來，以供未來追溯與稽核。
- **觸發後續流程**: **任務的最終「驗收通過」應能作為核心觸發器**，啟動其他系統。最直接的應用就是，**只有狀態為「已驗收完成」的任務，才有資格被納入到一張新的「計價單」中**，從而啟動「進度計價」系統。

## 2. 功能規劃與工作流程 (Features & Workflow)

此系統將作為「專案管理」與「合作夥伴/內部團隊」之間的橋樑。

1.  **委派 (Delegate)**
    - **觸發**: 專案經理在 `task-item.tsx` 中點擊「委派」按鈕。
    - **操作**: UI 彈出一個選擇器，允許經理選擇委派對象（可從 `teamMembers` 和 `partners` 集合中選擇）。
    - **狀態變更**: 任務的 `assignment.status` 更新為 `'Pending'`（等待對方接受）。

2.  **通知 (Notify)**
    - **觸發**: 委派成功後。
    - **操作**: 系統後端廣播一個 `'task.delegated'` 事件。
    - **後續**: `notification.listeners.ts` 監聽到此事件，向被委派方（`assigneeId`）發送一條通知：「您有一個來自 [專案名稱] 的新任務邀請」。

3.  **接受 / 拒絕 (Accept / Reject)**
    - **觸發**: 被委派方在其任務中心或透過通知點擊進入任務。
    - **操作**: UI 提供「接受」和「拒絕」（可選填寫拒絕原因）的按鈕。
    - **狀態變更**: `assignment.status` 更新為 `'Accepted'` 或 `'Rejected'`。如果被拒絕，任務的委派狀態重置，專案經理會收到通知。

4.  **執行與回報 (Execute & Report)**
    - **觸發**: 被委派方開始執行任務。
    - **操作**: 被委派方可以將 `assignment.status` 更新為 `'InProgress'`。他們可以在任務下附加評論、上傳檔案作為進度回報。

5.  **請求驗收 (Request Review)**
    - **觸發**: 被委派方完成任務。
    - **操作**: 點擊「請求驗收」按鈕。
    - **狀態變更**: `assignment.status` 更新為 `'PendingReview'`。
    - **通知**: 系統廣播 `'task.review_requested'` 事件，通知原始委派方（專案經理）進行驗收。

6.  **驗收與完成 (Review & Complete)**
    - **觸發**: 專案經理收到驗收通知。
    - **操作**: 專案經理審查工作成果。可以選擇「驗收通過」或「退回修改」（需填寫修改意見）。
    - **狀態變更**:
        - **通過**: `assignment.status` 更新為 `'Completed'`。整個委派流程結束。**此任務現在可以被用於計價。**
        - **退回**: `assignment.status` 重新回到 `'InProgress'`，並將修改意見記錄下來，通知被委派方。

## 3. 資料庫設計影響 (Database Design Impact)

為實現此系統，我們需要對 `projects` 集合中的 `Task` 物件結構進行核心擴展。

### 擴展 `Task` 物件結構

在每個 `Task` 物件中，新增一個 `assignment` 物件：

| 欄位 (在 assignment 物件內) | 類型 | 描述 |
| :--- | :--- | :--- |
| `type` | `'Internal'` \| `'Partner'` | 委派類型：內部團隊或外部合作夥伴。 |
| `assigneeId` | `string` | 被委派方的 ID，關聯到 `users` 或 `partners` 集合。 |
| `assigneeName` | `string` | 被委派方的名稱（冗餘儲存，方便顯示）。 |
| `status` | `'Pending'` \| `'Accepted'` \| `'Rejected'` \| `'InProgress'` \| `'PendingReview'` \| `'Completed'` | **核心狀態欄位**，驅動整個工作流程。 |
| `delegatedAt` | `Timestamp` | 任務被委派出去的時間。 |
| `acceptedAt` | `Timestamp` \| `null` | 任務被接受的時間。 |
| `completedAt` | `Timestamp` \| `null` | 任務被最終驗收通過的時間。 |
| `history` | `Array<Map>` | 記錄狀態變更的歷史，包含操作人、時間、備註（如拒絕或退回原因）。 |

## 4. 前端架構影響 (Frontend Architecture Impact)

- **`task-item.tsx` 重構**: 需要大幅重構此元件，使其能根據**當前使用者的角色**（是委派方還是被委派方）以及**任務的 `assignment.status`**，來動態顯示不同的資訊和操作按鈕。
- **「我的任務中心」頁面**: 需要為所有使用者（包括內部員工和外部合作夥伴的聯絡人）建立一個新的頁面，集中展示所有指派給他們的任務，並允許他們進行操作。
- **Server Actions**: 所有狀態變更都應透過 Server Actions 執行，以確保業務邏輯和權限檢查在伺服器端完成。

### 結構樹 (Structure Tree)
```text
src/
├── app/
│   └── (dashboard)/
│       ├── my-tasks/                   <-- 新路由
│       │   └── page.tsx
│       └── projects/
│           └── [id]/
│               └── page.tsx              <-- project-details-sheet.tsx 的邏輯會在這裡
├── components/
│   └── features/
│       ├── projects/
│       │   ├── actions/
│       │   │   └── assignment-actions.ts <-- 新 Server Actions
│       │   ├── components/
│       │   │   ├── task-item.tsx         <-- 重構此元件
│       │   │   └── delegate-task-dialog.tsx
│       │   └── types/
│       │       └── assignment-types.ts   <-- 新類型定義
│       └── my-tasks/                     <-- 新目錄
│           └── my-tasks-view.tsx
└── lib/
    └── events/
        └── app-events.ts                 <-- 新增 'task.delegated', 'task.review_requested' 等事件

```

---
**結論**: 這個「委派與驗收」系統是平台協作能力的基石。它的實現將使 Beta-db 從一個資訊記錄系統，蛻變為一個真正能夠管理和驅動複雜工程協作流程的強大平台。
