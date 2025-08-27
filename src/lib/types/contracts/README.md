# 合約服務層類型 (Contract Service-Layer Types)

此目錄定義了**服務層**在與資料庫（特別是 Firestore）互動時所使用的 TypeScript 類型。

## 設計目的

服務層的類型可能與前端 UI 元件使用的類型有所不同。最常見的區別是**日期/時間欄位的處理**：

- **服務層/資料庫層 (`FirebaseContract`)**: 日期通常以 Firestore 的 `Timestamp` 物件形式存在。
- **前端元件層 (`CoreContract`)**: 日期通常需要轉換為 JavaScript 的 `Date` 物件，以便於在日曆元件中顯示和操作。

將這些類型分開，可以讓我們在每一層都使用最適合該層的資料格式，並在它們之間的邊界進行明確的轉換，從而實現更清晰的架構。

## 檔案說明

- **`contract.types.ts`**: 定義了 `FirebaseContract` 介面，其 `startDate` 和 `endDate` 欄位被明確定義為 `Timestamp` 類型。
- **其他檔案**: 目前是佔位符，為未來可能出現的、更複雜的服務層特定類型預留了位置。