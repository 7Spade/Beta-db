# 專案功能元件 (Project Components)

此目錄包含所有構成「專案管理」功能前端介面的可重用 React 元件。

## 設計原則

- **職責單一**: 每個元件都有一個明確、單一的職責。例如，`ProjectList` 只負責渲染專案列表，而 `TaskItem` 只負責顯示單一任務項。
- **`PascalCase` 命名**: 所有元件檔案均遵循 `PascalCase.tsx` 的命名約定。
- **數據驅動**: 元件接收從 `views` 層傳遞過來的 `props` 來渲染 UI，並透過呼叫從 `actions` 目錄中導入的 Server Actions 來觸發後端操作。

## 核心元件

- **`ProjectsView.tsx`**: 整個專案管理模組的主視圖，負責狀態管理和協調其他元件。
- **`ProjectList.tsx`**: 渲染專案卡片列表 (`ProjectCard`)。
- **`ProjectCard.tsx`**: 以卡片形式顯示單一專案的摘要資訊。
- **`ProjectDetailsDialog.tsx`**: 用於顯示單一專案完整詳情的現代化對話框 (Dialog)。
  - **`ProjectSummary.tsx`**: 在詳情對話框中顯示專案的摘要資訊。
  - **`AddTaskPanel.tsx`**: 用於新增「頂層任務」的 UI 面板。
  - **`TaskList.tsx`**: 負責渲染任務樹狀結構。
    - **`TaskItem.tsx`**: 顯示單一任務項，並管理其子任務的顯示和互動。
      - **`TaskActions.tsx`**: 提供給 `TaskItem` 使用的操作按鈕組 (例如：新增子任務、AI 建議)。
      - **`AddSubtaskForm.tsx`**: 用於在 `TaskItem` 下方新增「子任務」的表單。
- **`AcceptanceList.tsx`**: 顯示待審批和已審批的驗收單列表。
