
# 「聯絡管理」系統 - 設計藍圖

本文件詳細闡述了如何將後台的「聯絡管理」功能與前台的「聯絡我們」頁面進行整合，建立一個高效、可追溯的客戶諮詢管理系統。

## 1. 核心目標 (Core Objectives)

- **集中化管理**: 將所有從網站「聯絡我們」表單提交的訊息，集中儲存在一個地方，避免使用混亂的共用信箱。
- **流程追蹤**: 為每一條客戶諮詢建立一個生命週期，可以追蹤其狀態（如：新進、處理中、已解決、垃圾訊息）。
- **指派與協作**: 允許管理員將特定的諮詢指派給團隊中的某個成員來負責處理。
- **數據分析**: 收集諮詢數據，用於分析客戶常見問題、回覆效率等，作為改善服務的依據。

## 2. 功能規劃 (Feature Breakdown)

- **後台功能 (`/admin/contact-management`)**:
  - **諮詢列表**: 以表格或卡片形式，展示所有收到的聯絡訊息。
  - **列表資訊**: 應包含提交者姓名、主旨、提交時間、當前狀態和負責處理的人員。
  - **狀態管理**: 管理員可以快速更改每條訊息的狀態（新進 -> 處理中 -> 已解決）。
  - **指派功能**: 可以將一條訊息指派給某位團隊成員 (`teamMembers`)。
  - **詳情檢視**: 點擊單條訊息可以查看完整的內容，並可在下方添加內部備註或回覆紀錄。
- **前台互動 (`/contact`)**:
  - **聯絡表單**: 提供一個標準的聯絡表單，包含姓名、Email、主旨、訊息內容等欄位。
  - **表單提交**: 使用 Server Action 將表單內容直接寫入後台的資料庫中。
  - **自動回覆**: (可選) 提交成功後，可以觸發一個事件，向提交者的 Email 發送一封自動確認回覆信。

## 3. 資料庫設計影響 (Database Design Impact)

為實現此功能，建議建立一個新的頂層集合：`contact_inquiries`。

### 集合: `contact_inquiries`

此集合儲存所有從「聯絡我們」頁面提交的訊息。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位         | 類型      | 描述                                                       |
|--------------|-----------|------------------------------------------------------------|
| `name`       | `string`  | 提交者的姓名。                                             |
| `email`      | `string`  | 提交者的電子郵件地址。                                     |
| `subject`    | `string`  | 訊息主旨。                                                 |
| `message`    | `string`  | 完整的訊息內容。                                           |
| `status`     | `string`  | **[查詢關鍵]** 'New', 'InProgress', 'Resolved', 'Spam'。預設為 'New'。 |
| `submittedAt`| `Timestamp`| 訊息提交的時間。                                           |
| `assigneeId` | `string`  | (可選) **[關聯]** 被指派處理此訊息的 `users` 文件 ID。 |
| `notes`      | `Array<Map>` | (可選) 用於記錄內部處理備註或回覆歷史。                 |

## 4. 前端架構影響 (Frontend Architecture Impact)

### 後台
- `/app/(admin)/contact-management/page.tsx` 需要被重構，以從 `contact_inquiries` 集合動態獲取數據並渲染列表。
- 需要建立一個新的元件，用於展示單一諮詢的詳細資訊和處理介面。

### 前台
- `/app/(public)/contact/page.tsx` 中的表單需要綁定一個新的 Server Action。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   ├── (admin)/
│   │   └── contact-management/
│   │       ├── page.tsx            <-- **重構**: 從 `contact_inquiries` 獲取數據
│   │       └── [id]/
│   │           └── page.tsx          <-- **新路由**: 查看單一諮詢詳情
│   └── (public)/
│       └── contact/
│           └── page.tsx              <-- **重構**: 將表單與 Server Action 綁定
└── components/
    └── features/
        ├── contact/                    <-- **新目錄**
        │   ├── actions/
        │   │   └── inquiry-actions.ts  # 提交表單、更新狀態的 Server Actions
        │   └── views/
        │       ├── inquiries-list-view.tsx # 後台諮詢列表元件
        │       └── inquiry-detail-view.tsx # 後台諮詢詳情元件
        └── admin/
            └── contact-management/     <-- (可選) 將後台元件放在這裡
```

---
**結論**: 將聯絡管理系統化，是將被動的客戶諮詢轉化為主動客戶關係管理的第一步。它不僅能提升內部處理效率，也能確保每一次的客戶互動都被妥善記錄和追蹤，是提升公司專業形象和服務品質的關鍵基礎建設。
