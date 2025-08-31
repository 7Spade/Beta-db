# 專案 Server Actions

此目錄包含所有與「專案管理」功能相關的後端業務邏輯，這些邏輯被封裝為 Next.js 的 **Server Actions**。

## 設計原則

- **`'use server'`**: 所有檔案都應在頂部包含 `'use server'` 指令。
- **職責劃分**: 每個檔案都應專注於一個特定的業務領域，以實現高內聚和低耦合。
- **安全性**: 所有資料庫操作和業務規則的驗證都在這些伺服器端檔案中執行，確保了操作的安全性。
- **數據一致性**: 在成功執行資料庫寫入操作後，會呼叫 `revalidatePath` 來觸發前端 UI 的自動更新，確保數據的一致性。

## 核心檔案

- **`project.actions.ts`**: 負責處理**專案級別**的 CRUD 操作，例如建立新專案。
- **`task.actions.ts`**: 負責處理專案下的**頂層任務**操作。
- **`subtask.actions.ts`**: 專門負責處理巢狀**子任務**的遞迴新增、修改和刪除。將複雜的遞迴邏輯與頂層任務操作分離。
- **`acceptance.actions.ts`**: 負責處理與「驗收單」相關的資料庫操作。
- **`workflow.actions.ts`**: 負責編排更複雜的業務流程，例如「提交進度以供審核」，它可能會在內部呼叫其他 actions 中的原子化操作。
- **`attachment.actions.ts`**: (未來擴展) 處理檔案附件（如施工照片、文件）的上傳與任務關聯。
- **`budget.actions.ts`**: (未來擴展) 處理專案預算調整、成本輸入等財務相關操作。
- **`progress.actions.ts`**: (未來擴展) 專門處理進度回報的相關邏輯。
- **`quality.actions.ts`**: (未來擴展) 處理品質檢驗、缺失改善等相關操作。
- **`safety.actions.ts`**: (未來擴展) 處理安全檢查、事故記錄等安衛相關操作。
- **`worker.actions.ts`**: (未來擴展) 處理工人出勤、工時記錄與任務分派。
- **`document.actions.ts`**: (未來擴展) 處理結構化的工程文件，如施工日誌、檢驗表單。
- **`communication.actions.ts`**: (未來擴展) 處理與任務相關的留言、討論或回報紀錄。
- **`notification.actions.ts`**: (未來擴展) 處理進度延遲、待簽核等事件的通知。
- **`report.actions.ts`**: (未來擴展) 處理各類報表的生成與匯出。
- **`audit-log.actions.ts`**: (未來擴展) 記錄所有關鍵操作的審計追蹤。
