# Firestore 資料庫設計 v2.1

**注意：此文件是 Firestore 資料庫模型的唯一事實來源 (Single Source of Truth)。**
對於高頻寫入的流水帳數據（如庫存移動、AI Token 消耗），請參考 [MongoDB 規劃文件](./mongodb.md)。

本文件詳細說明了 Constructo 平台在 Google Firestore 中的資料庫結構。v2.1 版本根據最新的系統藍圖進行了全面更新，以支援更複雜的協作與管理功能。

## 1. 核心基礎系統設計

### 1.1. `users`

此集合儲存所有使用者的設定檔、角色和狀態，是 **RBAC 系統**的基礎。

- **文件 ID**: Firebase Auth User UID (`string`)
- **文件結構**:

| 欄位          | 類型                                         | 描述                                       |
| ------------- | -------------------------------------------- | ------------------------------------------ |
| `displayName` | `string`                                     | 使用者的顯示名稱。                         |
| `email`       | `string`                                     | 使用者的電子郵件地址。                     |
| `role`        | `string` ('Admin', 'Member')                 | **[RBAC 核心]** 使用者角色，用於權限控制。 |
| `status`      | `string` ('pending', 'approved', 'rejected') | 帳號審核狀態，新用戶預設為 'pending'。     |
| `createdAt`   | `Timestamp`                                  | 帳號建立時間。                             |
| `approvedAt`  | `Timestamp`                                  | (可選) 帳號被核准的時間。                  |
| `approvedBy`  | `string`                                     | (可選) 核准此帳號的管理員 UID。            |

### 1.2. `notifications`

此集合用於驅動應用程式內的即時通知系統。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位          | 類型        | 描述                                        |
| ------------- | ----------- | ------------------------------------------- |
| `recipientId` | `string`    | 通知的接收者 `users` 文件 ID。              |
| `type`        | `string`    | 通知的類型，例如：`'new_user_for_approval'` |
| `message`     | `string`    | 通知的內容。                                |
| `link`        | `string`    | (可選) 點擊通知後應導向的頁面路徑。         |
| `isRead`      | `boolean`   | 標記此通知是否已被讀取，預設為 `false`。    |
| `createdAt`   | `Timestamp` | 通知的建立時間。                            |

### 1.3. `activity_logs`

此集合作為審計追蹤，記錄應用程式中的所有重要操作。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位         | 類型        | 描述                                                |
| ------------ | ----------- | --------------------------------------------------- |
| `actorId`    | `string`    | 執行此操作的使用者 `users` 文件 ID。                |
| `entityType` | `string`    | 被操作的實體類型，例如：`'project'`, `'task'`       |
| `entityId`   | `string`    | 被操作的實體文件 ID。                               |
| `action`     | `string`    | 執行的具體操作，例如：`'create'`, `'update_status'` |
| `details`    | `Map`       | (可選) 操作的詳細內容。                             |
| `timestamp`  | `Timestamp` | 操作發生的時間。                                    |

---

## 2. 核心業務模組

### 2.1. `projects`

此集合儲存所有營造專案的資訊。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位          | 類型                         | 描述                     |
| ------------- | ---------------------------- | ------------------------ |
| `ownerId`     | `string`                     | 建立此專案的使用者 UID。 |
| `customId`    | `string`                     | (可選) 自訂的專案編號。  |
| `title`       | `string`                     | 專案的標題或名稱。       |
| `description` | `string`                     | 專案的詳細描述。         |
| `client`      | `string`                     | (可選) 客戶名稱。        |
| `value`       | `number`                     | 專案的總合約價值。       |
| `startDate`   | `Timestamp`                  | 專案的開始日期。         |
| `endDate`     | `Timestamp`                  | 專案的預計結束日期。     |
| `tasks`       | `Array<Map>` (Task 物件陣列) | 專案下的任務列表。       |

#### 巢状 `Task` 物件結構 (v2.1)

| 欄位                | 類型            | 描述                                                        |
| ------------------- | --------------- | ----------------------------------------------------------- |
| `id`                | `string`        | 任務的唯一 ID。                                             |
| `title`             | `string`        | 任務的標題。                                                |
| `value`             | `number`        | 任務的價值 (quantity \* unitPrice)。                        |
| `quantity`          | `number`        | **[核心]** 任務的總量。                                     |
| `unitPrice`         | `number`        | **[核心]** 任務的單價。                                     |
| `completedQuantity` | `number`        | **[核心]** 已被批准的完成數量，由驗收單自動更新。預設為 0。 |
| `requiredSkills`    | `Array<string>` | (可選) 執行此任務所需的技能 ID 列表。                       |
| `assignment`        | `Map`           | (可選) **任務委派物件**。                                   |
| `subTasks`          | `Array<Map>`    | (Task 物件陣列) 巢狀的子任務列表。                          |

#### 巢状 `Assignment` 物件結構

| 欄位           | 類型                      | 描述                                                                                      |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| `type`         | `'Internal'`\|`'Partner'` | 委派類型。                                                                                |
| `assigneeId`   | `string`                  | 被委派方的 ID (`users` 或 `partners` ID)。                                                |
| `assigneeName` | `string`                  | 被委派方的名稱。                                                                          |
| `status`       | `string`                  | 委派狀態（`'Pending'`, `'Accepted'`, `'InProgress'`, `'PendingReview'`, `'Completed'`）。 |
| `history`      | `Array<Map>`              | 狀態變更歷史紀錄。                                                                        |

### 2.2. `acceptance_records` (新集合)

此集合儲存所有獨立的驗收單，將驗收流程與任務本身解耦。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位                | 類型            | 描述                                                                               |
| ------------------- | --------------- | ---------------------------------------------------------------------------------- |
| `title`             | `string`        | 驗收單的標題（例如：「五月份一樓水電工程驗收」）。                                 |
| `projectId`         | `string`        | **[關聯]** `projects` ID，標明此驗收單屬於哪個專案。                               |
| `taskId`            | `string`        | **[關聯]** 此驗收單對應的 `projects` 中的任務 ID。                                 |
| `submittedQuantity` | `number`        | **[核心]** 本次提交驗收的數量。                                                    |
| `applicantId`       | `string`        | **[關聯]** `users` ID，申請驗收的人員。                                            |
| `reviewerId`        | `string`        | **[關聯]** `users` ID，應負責審核此驗收單的人員。                                  |
| `status`            | `string`        | **核心狀態**：'草稿', '待審批', '已批准', '已駁回'。                               |
| `linkedTaskIds`     | `Array<string>` | (棄用) 關聯的 `projects` 中的任務 ID 列表。                                        |
| `notes`             | `string`        | (可選) 關於此次驗收的備註或說明。                                                  |
| `attachments`       | `Array<Map>`    | (可選) 驗收照片或文件列表 (`{ name: string, url: string }`)。                      |
| `history`           | `Array<Map>`    | (可選) 審批歷史紀錄 (`{ action: string, userId: string, timestamp: Timestamp }`)。 |
| `submittedAt`       | `Timestamp`     | 提交審批的時間。                                                                   |
| `reviewedAt`        | `Timestamp`     | (可選) 完成審批的時間。                                                            |

### 2.3. `contracts`

此集合儲存所有合約的資訊。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位              | 類型         | 描述                            |
| ----------------- | ------------ | ------------------------------- |
| `customId`        | `string`     | (可選) 自訂的合約編號。         |
| `name`            | `string`     | 合約的名稱。                    |
| `contractor`      | `string`     | 承包商的名稱。                  |
| `client`          | `string`     | 客戶的名稱。                    |
| `totalValue`      | `number`     | 合約的總價值。                  |
| `status`          | `string`     | 合約的當前狀態。                |
| `paymentSchedule` | `Array<Map>` | (可選) 付款排程，用於進度計價。 |
| `versions`        | `Array<Map>` | 合約版本歷史記錄。              |

### 2.4. `billing_requests`

此集合用於儲存所有產生的計價單。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
  | 欄位 | 類型 | 描述 |
  |-----------------|---------------------|--------------------------------------------|
  | `contractId` | `string` | 關聯的 `contracts` ID。 |
  | `projectId` | `string` | 關聯的 `projects` ID。 |
  | `status` | `string` | 計價單狀態 (`'Draft'`, `'Approved'`, etc.) |
  | `totalAmount` | `number` | 計價單總金額。 |
  | `linkedAcceptanceIds` | `Array<string>` | **核心欄位**，關聯的已批准驗收單 ID。 |

### 2.5. `partners`

此集合儲存所有合作夥伴（如供應商、下游包商）的資訊。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位                 | 類型            | 描述                         |
| -------------------- | --------------- | ---------------------------- |
| `name`               | `string`        | 合作夥伴的公司名稱。         |
| `category`           | `string`        | 合作夥伴的類別。             |
| `status`             | `string`        | 合作夥伴的狀態。             |
| `flowType`           | `string`        | 廠商的財務流程類型。         |
| `receivableWorkflow` | `Array<string>` | 客製化的應收款狀態流程步驟。 |
| `payableWorkflow`    | `Array<string>` | 客製化的應付款狀態流程步驟。 |
| `contacts`           | `Array<Map>`    | 聯絡人列表。                 |

### 2.6. `financial_documents`

此集合儲存所有與合作夥伴相關的應收與應付單據。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位          | 類型                        | 描述                         |
| ------------- | --------------------------- | ---------------------------- |
| `partnerId`   | `string`                    | 關聯的 `partners` ID。       |
| `type`        | `'receivable'`\|`'payable'` | 單據類型。                   |
| `amount`      | `number`                    | 單據金額。                   |
| `currentStep` | `string`                    | 在對應工作流程中的目前步驟。 |
| `dueDate`     | `Timestamp`                 | 到期日。                     |
| `history`     | `Array<Map>`                | 流程變更歷史。               |

### 2.7. `teamMembers`

此集合儲存內部團隊成員的資訊。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位         | 類型            | 描述                        |
| ------------ | --------------- | --------------------------- |
| `name`       | `string`        | 成員姓名。                  |
| `role`       | `string`        | 成員在團隊中的職位。        |
| `email`      | `string`        | 成員的電子郵件地址。        |
| `hourlyRate` | `number`        | (可選) 時薪，用於成本計算。 |
| `skillIds`   | `Array<string>` | (可選) 擁有的技能 ID 列表。 |

### 2.8. `schedules`

此集合用於儲存所有的排班記錄。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位        | 類型        | 描述                                       |
| ----------- | ----------- | ------------------------------------------ |
| `memberId`  | `string`    | **[關聯]** `teamMembers` ID。              |
| `projectId` | `string`    | **[關聯]** `projects` ID。                 |
| `taskId`    | `string`    | (可選) **[關聯]** `projects` 內的任務 ID。 |
| `startDate` | `Timestamp` | 排班開始時間。                             |
| `endDate`   | `Timestamp` | 排班結束時間。                             |

### 2.9. `daily_reports`

此集合儲存所有專案的每日報告。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位         | 類型         | 描述                                     |
| ------------ | ------------ | ---------------------------------------- |
| `projectId`  | `string`     | **[關聯]** `projects` ID。               |
| `reportDate` | `Timestamp`  | 報告對應的日期。                         |
| `manpower`   | `Array<Map>` | 當日出勤人力記錄 (`memberId`, `hours`)。 |
| `workLog`    | `string`     | 當日施工項目和進度描述。                 |
| `photos`     | `Array<Map>` | 現場照片 (`storagePath`)。               |

---

## 3. 倉儲管理模組

### 3.1. `warehouses`

定義了所有實體的倉庫或庫存地點。

| 欄位       | 類型      | 描述                       |
| ---------- | --------- | -------------------------- |
| `name`     | `string`  | 倉庫的唯一名稱。           |
| `isActive` | `boolean` | 標記此倉庫是否仍在運作中。 |

### 3.2. `inventory_items`

物料的**主檔目錄**，不包含庫存數量。

| 欄位       | 類型     | 描述              |
| ---------- | -------- | ----------------- |
| `name`     | `string` | 物料/工具的名稱。 |
| `category` | `string` | 物料分類。        |
| `unit`     | `string` | 計量單位。        |

### 3.3. `inventory_levels`

**核心庫存集合**。每一份文件代表「一個物料在一個倉庫的庫存量」。

- **文件 ID**: `"{itemId}_{warehouseId}"`
  | 欄位 | 類型 | 描述 |
  |-------------|-----------|------------------------------|
  | `itemId` | `string` | **[關聯]** `inventory_items` ID。 |
  | `warehouseId`| `string` | **[關聯]** `warehouses` ID。 |
  | `quantity` | `number` | **核心**。當前的實際庫存數量。|

---

## 4. 內容管理模組

### 4.1. `posts`

儲存所有部落格文章。

| 欄位      | 類型     | 描述                              |
| --------- | -------- | --------------------------------- |
| `title`   | `string` | 文章標題。                        |
| `slug`    | `string` | **[查詢關鍵]** URL 的唯一識別符。 |
| `content` | `string` | 文章內容。                        |
| `status`  | `string` | '已發布', '草稿', '已封存'。      |

### 4.2. `job_postings`

儲存所有職位空缺。

| 欄位     | 類型     | 描述                         |
| -------- | -------- | ---------------------------- |
| `title`  | `string` | 職位名稱。                   |
| `status` | `string` | '開放中', '已關閉', '草稿'。 |

### 4.3. `job_applications`

儲存所有收到的應徵申請。

| 欄位            | 類型     | 描述                           |
| --------------- | -------- | ------------------------------ |
| `jobId`         | `string` | **[關聯]** `job_postings` ID。 |
| `applicantName` | `string` | 應徵者姓名。                   |
| `resumeUrl`     | `string` | 履歷檔案的儲存 URL。           |
| `status`        | `string` | '待審查', '面試中', etc.       |

### 4.4. `contact_inquiries`

儲存所有從「聯絡我們」頁面提交的訊息。

| 欄位     | 類型     | 描述                            |
| -------- | -------- | ------------------------------- |
| `name`   | `string` | 提交者的姓名。                  |
| `email`  | `string` | 提交者的電子郵件地址。          |
| `status` | `string` | 'New', 'InProgress', 'Resolved' |

### 4.5. `structured_content`

儲存動態頁面內容的無頭 CMS 集合。

- **文件 ID**: `home_page_hero`, `about_page_mission`
- **文件結構**: 動態的鍵值對。

```json
{
  "title": "領先的精密設備整合服務專家",
  "subtitle": "從前期評估、客製化設計到無塵室整合與持續維護..."
}
```
