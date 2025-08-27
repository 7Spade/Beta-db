# Context 目錄

此目錄存放應用程式中所有 React Context Provider。Context 用於在元件樹中進行全局或半全局的狀態管理，避免了在多層元件之間手動傳遞 props 的問題（即 "prop drilling"）。

**注意**: 為了集中管理，大多數全域 Context Provider 的邏輯最終會被整合到 `/src/components/layout/core/app-provider.tsx` 中。此目錄下的檔案主要負責定義 Context 本身和其初始邏輯。

## 檔案說明

- **`ProjectContext.tsx`**:
  - **職責**: 專門用於管理**專案**相關的全局狀態和操作。
  - **功能**:
    - 使用 Firebase 的 `onSnapshot` 來即時獲取和訂閱 `projects` 集合的數據。
    - 提供一個 `projects` 陣列和 `loading` 狀態給所有子元件。
    - 提供 `addProject`, `updateTaskStatus`, `addTask` 等方法，讓子元件可以安全地修改專案數據。
  - **使用方式**: 任何需要存取或操作專案資料的元件都可以透過 `useProjects` 這個自定義 Hook 來連接到此 Context。
