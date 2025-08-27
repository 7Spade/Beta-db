# 核心應用程式路由群組 (Dashboard Route Group)

此 `(dashboard)` 路由群組是使用者登入後與應用程式互動的核心區域。

## 用途

- **統一佈局**: 此群組內的所有頁面（例如儀表板、專案、合約等）都會共享定義在 `src/app/(dashboard)/layout.tsx` 中的 `AppShell` 佈局。這個佈局提供了完整的應用程式體驗，通常包含主側邊欄、頁首和內容區域。
- **權限保護**: 雖然路由群組本身不提供權限控制，但它在邏輯上將所有需要使用者登入才能訪問的頁面組織在一起。實際的權限驗證由 `layout.tsx` 中的 `AuthProvider` 處理。

## 檔案結構

- **`layout.tsx`**: 為此群組內的所有頁面提供共享的 UI 佈局，並包裹了所有必要的 Context Provider（如 `AuthProvider`, `AppProvider`）。
- **子目錄**: 每個子目錄（如 `dashboard`, `projects`, `contracts`）都代表一個獨立的核心功能區段。
