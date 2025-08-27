# 跨模組儀表板元件 (Shared Dashboard Components)

此目錄存放**不屬於單一功能模組**，但用於在主儀表板 (`/app/(dashboard)/dashboard/page.tsx`) 上顯示的通用或聚合型元件。

## 設計原則

當一個元件需要**聚合來自多個不同功能模組的資訊**，或者提供一個**全局性的概覽**時，它就應該被放置在這裡，而不是放在任何一個特定的 `features` 子目錄中。

## 元件

- **`dashboard-view.tsx`**: 主儀表板的根元件，負責組合和佈局來自不同模組的儀表板區塊。
- **`dashboard-stats.tsx`**: 一個可重用的統計卡片佈局元件，接收一個 `stats` 陣列並渲染一組標準化的統計數據卡片。
- **`ai-usage-log.tsx`**: 顯示近期 Genkit AI Token 消耗紀錄的元件。這是一個很好的例子，因為 AI 的使用情況是跨越多個功能模組（如 DocuParse, 內容生成等）的全局性資訊。
