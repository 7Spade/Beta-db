# UI 佈局系統架構 (Layout System Architecture)

## 1. 總覽 (Overview)

本文件旨在詳細闡述對現有佈局系統 (位於 `src/components/layout`) 的兩項關鍵優化策略。目前的佈局系統結構清晰、模組化程度高，本次計畫的目標並非重構，而是在現有良好基礎上進行**精煉與加固**，以進一步提升應用程式的性能、可維護性，並使其更深度地契合 Next.js App Router 的設計哲學。

## 2. 核心優化策略

我們將專注於以下兩個主要方向：

### 策略一：`AppHeader` 的伺服器/客戶端邊界優化
- **目標**：利用 Next.js Server Components 的優勢，加速頁面初始渲染速度。
- **做法**：將目前的 `AppHeader` 元件拆分為一個靜態的伺服器「骨架」和一個動態的客戶端「內容」元件。

### 策略二：集中化狀態管理 (Context Provider Consolidation)
- **目標**：簡化全域狀態管理，提供單一、清晰的狀態來源。
- **做法**：將 `SidebarProvider` 的邏輯整合進現有的 `AppProvider` 中，使其成為所有應用程式級別 Context 的唯一入口。

---

## 3. 執行計畫詳解

### 3.1. `AppHeader` 邊界優化

#### **目前狀況分析**
`AppShell.tsx` 透過 `useEffect` 來延遲 `AppHeader` 的渲染，以避免客戶端 Hooks（如 `useAuth`, `useSidebar`）造成的水合作用錯誤 (Hydration Error)。這雖然有效，但犧牲了伺服器渲染的潛在性能優勢。

#### **重構步驟**

1.  **建立 `AppHeader.tsx` (伺服器元件)**
    *   **路徑**: `src/components/layout/core/app-header.tsx` (修改現有檔案)
    *   **職責**:
        *   將此檔案重構為一個**伺服器元件**。
        *   負責渲染 `AppHeader` 的靜態「骨架」，包括 `<header>` 標籤、背景、邊框和主要的 `flex` 佈局容器。
        *   它將透過 `children` prop 接收一個客戶端元件。

2.  **建立 `AppHeaderClient` (客戶端元件)**
    *   **路徑**: `src/components/layout/core/app-header-client.tsx` (新檔案)
    *   **職責**:
        *   這是一個 `'use client'` 元件。
        *   包含所有需要互動和客戶端狀態的部分：`SidebarTrigger`、`Breadcrumb`、`UserMenu` 以及未來的 `NotificationCenter`。
        *   所有 Hooks (`useAuth`, `useSidebar`, `usePathname`) 的使用都將被限制在此檔案內。

3.  **整合**
    *   在 `AppHeader.tsx` 中，引入並渲染 `<AppHeaderClient />` 作為其子元件。
    *   在 `AppShell.tsx` 中，移除 `useEffect` 和 `useState` 的邏輯，直接渲染 `<AppHeader />`。

#### **預期效益**
-   **性能提升**: 伺服器可以直接渲染頁面頂部欄的靜態框架，改善使用者感知的初始載入速度 (FCP/LCP)。
-   **架構清晰**: 強制性地劃分了伺服器與客戶端的職責，使程式碼結構更符合 Next.js 的最佳實踐。

---

### 3.2. 狀態管理集中化

#### **目前狀況分析**
`AppProvider` 目前管理 `Theme` 和 `Project` 的 Context，而 `Sidebar` 的狀態則由其自身的 `SidebarProvider` 管理。這使得全域狀態的來源分散。

#### **重構步驟**

1.  **合併 Provider 邏輯**
    *   **來源檔案**: `src/components/ui/sidebar.tsx`
    *   **目標檔案**: `src/components/layout/core/app-provider.tsx`
    *   **操作**:
        *   將 `SidebarProvider` 元件內的所有狀態管理邏輯（`useState`, `useEffect`, `useCallback`）**剪下**。
        *   將這些邏輯**貼上**到 `AppProvider` 元件內部。
        *   讓 `AppProvider` 直接提供 `SidebarContext.Provider`。

2.  **簡化 `Sidebar` 元件**
    *   `src/components/ui/sidebar.tsx` 中的 `SidebarProvider` 將不再需要，可以移除或將其內部邏輯替換為直接從 `AppProvider` 匯出。為了保持 API 的一致性，建議保留匯出，但其內部實現將委託給 `AppProvider`。

3.  **更新根佈局**
    *   在 `src/app/(dashboard)/layout.tsx` 中，確認所有子元件都被 `<AppProvider>` 包裹。現在，這個單一的 Provider 將同時提供主題、專案和側邊欄的狀態。

#### **預期效益**
-   **單一事實來源**: 所有應用程式級別的 Context 都由 `AppProvider` 提供，使全域狀態的管理入口點清晰統一。
-   **可維護性**: 當需要新增或修改全域狀態時，開發者只需關注 `AppProvider.tsx` 一個檔案。
-   **簡化結構**: 避免了在根佈局中出現層層嵌套的 Provider，讓元件樹更加簡潔。

---

## 4. 風險評估

此計畫屬於架構層面的優化，風險較低，因為它不直接修改核心業務功能。主要風險在於：

1.  **水合作用錯誤 (Hydration Errors)**：在拆分 `AppHeader` 時，必須確保所有客戶端互動的程式碼都嚴格地保留在客戶端元件中。
2.  **Context 依賴**: 在合併 Provider 時，需確保元件樹的結構正確，所有消費 Context 的子元件都在 `AppProvider` 的包裹之下。

透過遵循上述步驟，我們可以系統性地完成這些優化，為應用程式的長期健康發展奠定更堅實的基礎。
