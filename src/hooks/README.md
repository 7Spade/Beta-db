# 自定義 Hooks 目錄 (Custom Hooks)

此目錄存放應用程式中所有可重用的自定義 React Hooks。Hooks 是一種強大的模式，可以將元件的狀態邏輯提取出來，以便在多個元件之間共享，讓程式碼更乾淨、更易於維護。

## 檔案說明

- **`use-toast.ts`**: 一個用於顯示美觀通知訊息 (Toast) 的自定義 Hook。它提供了一個 `toast` 函數，可以在應用程式的任何地方觸發通知，而無需將狀態提升到頂層。

- **`use-mobile.tsx`**: 一個簡單的工具 Hook，用於偵測當前瀏覽器的視窗寬度是否小於預設的行動裝置斷點 (breakpoint)。這有助於在 React 元件中根據螢幕尺寸執行不同的邏輯或渲染不同的 UI。

- **`use-notifications.ts`**: 一個專用於通知中心的 Hook。它負責：
  - 根據當前使用者 ID，即時監聽 Firestore 中的 `notifications` 集合。
  - 管理通知的讀取和關閉狀態。
  - 將最新的通知列表和未讀計數提供給 UI 元件。
