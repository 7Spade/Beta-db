# 通用工具函數 (Utilities)

此目錄包含純粹的、無副作用的、可在整個應用程式中重用的通用輔助函數。

**原則**:

- 這裡的函數不應該有任何外部依賴（除了其他 `utils` 或 `constants`）。
- 它們應該是可預測的：給定相同的輸入，總是返回相同的輸出。

**範例**:

- `date.utils.ts` (例如: `formatDate`)
- `string.utils.ts` (例如: `truncate`)
- `currency.utils.ts` (例如: `formatMoney`)
