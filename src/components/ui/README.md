# 基礎 UI 元件庫 (UI Components)

此目錄是我們應用程式的**原子設計層 (Atomic Design)**，基於 **shadcn/ui** 建立。它包含了所有最基礎、可重用的 UI 元件。

## 設計原則

- **無業務邏輯**: 此目錄中的所有元件都**嚴格禁止**包含任何業務邏輯。它們是純粹的、展示性的元件。例如，`Button` 元件只知道如何渲染一個按鈕，但不知道點擊它會觸發「儲存合約」的動作。
- **高可重用性**: 這些元件（如 `Card`, `Input`, `Table`）被設計為可以在應用程式的任何地方使用。
- **樣式一致性**: 所有元件都遵循 `globals.css` 中定義的設計系統和主題變數，確保整個應用程式的視覺風格保持一致。

## 元件分類

- **表單元件**: `input`, `form`, `select`, `checkbox`, `radio-group`, `textarea`
- **佈局元件**: `card`, `accordion`, `collapsible`, `separator`, `sheet`
- **導航元件**: `breadcrumb`, `tabs`, `sidebar`, `menubar`
- **反饋元件**: `alert`, `toast`, `progress`, `skeleton`
- **資料展示**: `table`, `chart`, `calendar`, `carousel`
- **互動元件**: `button`, `dialog`, `popover`, `tooltip`, `dropdown-menu`

這些元件是構建所有 `features/` 目錄下複雜功能元件的基石。
