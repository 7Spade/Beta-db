# 合作夥伴財務元件 (Partner Financials Components)

此目錄存放與 `PartnerVerse` 模組中「財務」流程相關的元件。

## 元件

- **`financials-tab.tsx`**: 作為財務標籤頁的進入點，它主要渲染 `WorkflowDesigner`。
- **`workflow-designer.tsx`**: 核心元件，提供一個介面，讓使用者可以為每個合作夥伴自定義應收 (Receivable) 和應付 (Payable) 的工作流程步驟。例如，一個應收款流程可以是：「開立發票」->「等待付款」->「確認收款」。
