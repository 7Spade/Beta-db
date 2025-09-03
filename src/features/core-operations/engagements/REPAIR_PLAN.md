# Engagement 模組修復計畫

## 修復目標
修復所有 TypeScript 編譯錯誤，確保模組功能完整性和類型安全性。

## 當前狀態
**最新更新**: 2024年12月19日  
**錯誤數量**: 80 個錯誤（從 118 個減少）  
**已完成階段**: 5/9 個階段  
**修復進度**: 55.6%

### 已完成階段
- ✅ 階段 1: 類型定義修復
- ✅ 階段 2: 服務方法實現  
- ✅ 階段 3: 導出衝突解決
- ✅ 階段 4: Timestamp 轉換統一
- ✅ 階段 5: 表單類型對齊

### 待完成階段
- ❌ 階段 6: 工具函數補全
- ❌ 階段 7: 組件屬性修復
- ❌ 階段 8: 空目錄填充
- ❌ 階段 9: 代碼品質改進

## 修復階段

### 階段 1：類型定義修復（高優先級） ✅ 已完成

#### 1.1 修復類型導入問題
**檔案：** `types/engagement.types.ts`
**問題：** 缺少 16 個類型導入
**修復：**
```typescript
// 在檔案頂部添加導入
import type {
  Task, Payment, Receipt, Invoice, ChangeOrder,
  EngagementVersion, Milestone, Deliverable,
  AcceptanceRecord, QualityCheck, Risk, Issue,
  Communication, Meeting, Attachment, AuditLogEntry
} from './index';
```

#### 1.2 修復重複定義
**檔案：** `types/communication.types.ts`
**問題：** `upcomingMeetings` 重複定義
**修復：** 移除重複定義，保留正確的類型

#### 1.3 修復導出錯誤
**檔案：** `types/index.ts`
**問題：** `DeliverableType` 不存在
**修復：** 改為導出 `Deliverable`

### 階段 2：服務方法實現（高優先級） ✅ 已完成

#### 2.1 在 EngagementService 中實現缺失方法
**檔案：** `services/engagement.service.ts`
**需要實現的方法：**
- `addMeeting(engagementId: string, meeting: Omit<Meeting, 'id'>)`
- `updateMeeting(engagementId: string, meetingId: string, updates: Partial<Meeting>)`
- `deleteMeeting(engagementId: string, meetingId: string)`
- `addDocument(engagementId: string, document: Omit<Document, 'id'>)`
- `updateDocument(engagementId: string, documentId: string, updates: Partial<Document>)`
- `deleteDocument(engagementId: string, documentId: string)`
- `addAttachment(engagementId: string, attachment: Omit<Attachment, 'id'>)`
- `deleteAttachment(engagementId: string, attachmentId: string)`

### 階段 3：導出衝突解決（高優先級） ✅ 已完成

#### 3.1 修復重複導出
**檔案：** `index.ts`
**問題：** 組件和類型重複導出
**修復策略：**
- 使用明確導出而非 `export *`
- 為重複名稱添加別名
- 重新組織導出結構

### 階段 4：Timestamp 轉換統一（中優先級） ✅ 已完成

#### 4.1 創建日期轉換工具
**檔案：** `utils/date.utils.ts`（新建）
**功能：**
```typescript
export const convertTimestamp = (timestamp: Date | Timestamp): Date => {
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

export const formatDate = (date: Date | Timestamp): string => {
  const jsDate = convertTimestamp(date);
  return jsDate.toLocaleDateString('zh-TW');
};
```

#### 4.2 更新所有使用 Timestamp 的組件
**受影響檔案：**
- `components/communication/communication-list.tsx`
- `components/communication/meeting-list.tsx`
- `components/documents/attachment-list.tsx`
- `components/documents/document-list.tsx`
- `components/reports/dashboard-charts.tsx`
- `components/reports/progress-report.tsx`
- `utils/financial.utils.ts`

### 階段 5：表單類型對齊（中優先級） ✅ 已完成

#### 5.1 修復表單輸入類型
**需要修復的表單：**
- `CreateAcceptanceRecordInput`
- `CreateQualityCheckInput`
- `CreateIssueInput`
- `CreateRiskInput`

**修復策略：**
- 創建統一的表單輸入類型
- 確保與對應實體類型兼容
- 添加必要的默認值處理

#### 5.2 修復表單組件
**受影響檔案：**
- `components/quality/acceptance-record-form.tsx`
- `components/quality/quality-check-form.tsx`
- `components/risk/issue-form.tsx`
- `components/risk/risk-form.tsx`

### 階段 6：工具函數補全（中優先級） ❌ 待開始

#### 6.1 實現缺失的財務工具函數
**檔案：** `utils/financial.utils.ts`
**需要實現：**
- `formatCurrency(amount: number): string`
- 改進現有的計算函數

#### 6.2 修復發票表單
**檔案：** `components/financial/invoice-form.tsx`
**問題：** 缺少 `totalPrice` 計算
**修復：** 在添加項目時自動計算總價

### 階段 7：組件屬性修復（中優先級）

#### 7.1 修復 UpdateEngagementInput 類型
**檔案：** `types/engagement.types.ts`
**修復：** 添加 `tasks` 屬性

#### 7.2 修復 CreateEngagementInput 類型
**檔案：** `types/engagement.types.ts`
**修復：** 添加 `progress` 屬性

### 階段 8：空目錄填充（低優先級）

#### 8.1 創建 Charts 組件
**目錄：** `components/charts/`
**需要創建：**
- `index.ts`
- `engagement-chart.tsx`
- `financial-chart.tsx`
- `progress-chart.tsx`

#### 8.2 創建 Dialogs 組件
**目錄：** `components/dialogs/`
**需要創建：**
- `index.ts`
- `confirmation-dialog.tsx`
- `engagement-dialog.tsx`

#### 8.3 創建 Tables 組件
**目錄：** `components/tables/`
**需要創建：**
- `index.ts`
- `engagement-table.tsx`
- `task-table.tsx`

### 階段 9：代碼品質改進（低優先級）

#### 9.1 修復隱式 any 類型
**受影響檔案：**
- `components/reports/progress-report.tsx`
- `components/reports/quality-report.tsx`

#### 9.2 修復未定義變數
**檔案：** `views/engagement-detail-view.tsx`
**修復：** 實現 `handleRefresh` 函數

#### 9.3 改進錯誤處理
- 添加空值檢查
- 改進類型斷言
- 統一錯誤處理模式

## 實施順序

### 第一輪（必須完成）
1. 階段 1：類型定義修復
2. 階段 2：服務方法實現
3. 階段 3：導出衝突解決

### 第二輪（功能完整性）
4. 階段 4：Timestamp 轉換統一
5. 階段 5：表單類型對齊
6. 階段 6：工具函數補全

### 第三輪（代碼品質）
7. 階段 7：組件屬性修復
8. 階段 8：空目錄填充
9. 階段 9：代碼品質改進

## 測試策略

### 每階段完成後
1. 運行 `npx tsc --noEmit` 檢查編譯錯誤
2. 運行 `npm run build` 檢查構建成功
3. 檢查相關功能是否正常

### 最終驗證
1. 所有 TypeScript 錯誤清零
2. 構建成功
3. 功能測試通過
4. 代碼品質檢查通過

## 風險控制

### 高風險操作
- 修改核心類型定義
- 重構服務方法
- 修改導出結構

### 風險緩解
- 每階段完成後立即測試
- 保留原始檔案備份
- 使用版本控制追蹤變更
- 分階段提交代碼

## 預估時間

- **階段 1-3**：3-4 小時（高優先級）
- **階段 4-6**：4-5 小時（中優先級）
- **階段 7-9**：3-4 小時（低優先級）
- **總計**：10-13 小時

## 成功標準

1. ✅ TypeScript 編譯無錯誤
2. ✅ 構建成功
3. ✅ 所有功能正常運作
4. ✅ 代碼品質達標
5. ✅ 文檔完整更新

---

*修復計畫制定時間：2024年12月19日*
*預計完成時間：2024年12月20日*
