# 佈局系統強化計畫 (Layout System Enhancement Plan)

## 1. 總覽 (Overview)

本文件旨在詳細闡述對現有佈局系統 (位於 `src/components/layout`) 的三項關鍵優化策略。目前的佈局系統結構清晰、模組化程度高，本次計畫的目標並非重構，而是在現有良好基礎上進行**精煉與加固**，以進一步提升應用程式的性能、可維護性、使用者體驗，並使其更深度地契合 Next.js App Router 的設計哲學。

## 2. 核心優化策略

我們將專注於以下三個主要方向：

### 策略一：`AppHeader` 的伺服器/客戶端邊界優化
- **目標**：利用 Next.js Server Components 的優勢，加速頁面初始渲染速度。
- **做法**：將目前的 `AppHeader` 元件拆分為一個靜態的伺服器「骨架」和一個動態的客戶端「內容」元件。

### 策略二：集中化狀態管理 (Context Provider Consolidation)
- **目標**：簡化全域狀態管理，提供單一、清晰的狀態來源。
- **做法**：將 `SidebarProvider` 的邏輯整合進現有的 `AppProvider` 中，使其成為所有應用程式級別 Context 的唯一入口。

### 策略三：響應式佈局策略 (Responsive Layout Strategy)
- **目標**：確保應用程式在從移動設備到大尺寸桌面螢幕的各種裝置上，都能提供卓越、一致的使用者體驗。
- **做法**：採用「移動設備優先」的設計原則，並針對不同斷點 (breakpoints) 設計特定的佈局模式。

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

### 3.3. 響應式佈局策略

#### **設計原則**
- **移動設備優先 (Mobile-First)**: 設計應從最小的螢幕開始，逐步增強以適應更大的螢幕。這確保了核心功能在所有設備上都是可用的。
- **斷點一致性**: 使用 Tailwind CSS 的標準斷點 (`sm`, `md`, `lg`, `xl`) 來確保整個應用程式的響應式行為是一致的。

#### **具體實現**

1.  **側邊欄 (Sidebar)**
    - **移動設備 (Mobile, <768px)**:
        - 側邊欄 (`UnifiedSidebar`) **預設隱藏**，以最大化內容可視區域。
        - 頂部導航欄 (`AppHeader`) 中會顯示一個「漢堡」圖示按鈕 (`Menu` icon)。
        - 點擊該按鈕，側邊欄會以**抽屜 (Drawer)** 的形式從螢幕左側滑出，覆蓋在主內容之上。這將使用 `shadcn/ui` 的 `Sheet` 元件來實現。
    - **桌面設備 (Desktop, >=768px)**:
        - 側邊欄**預設可見**並固定在螢幕左側。
        - 側邊欄是**可摺疊的**。使用者可以點擊觸發器，將其從完整寬度（顯示圖示和文字）收縮為一個僅顯示圖示的窄邊欄 (icon rail)，從而為主要內容區域提供更多空間。

2.  **頁面內容 (Page Content)**
    - **網格佈局 (Grid Layout)**: 儀表板、卡片列表等內容將優先使用 CSS Grid 進行佈局。例如，使用 `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4` 這樣的 class，可以讓卡片列表在手機上單行顯示，在平板上兩列顯示，在桌面上四列顯示。
    - **表格 (Tables)**: 對於寬表格，在移動設備上，重要的欄位會被保留，次要的欄位將被隱藏（使用 `hidden md:table-cell` 等 class），以避免水平滾動條的出現，或採用水平滾動的容器來包裹表格。
    - **字體與間距**: 使用相對單位和響應式字體大小，確保在不同螢幕上的可讀性。

#### **預期效益**
-   **優化使用者體驗**: 為每種設備提供最適合其螢幕尺寸的佈局和互動方式。
-   **提升可及性**: 確保所有功能在小螢幕設備上也能輕鬆操作。
-   **單一程式碼庫**: 使用 Tailwind CSS 的響應式修飾符，使我們能夠在同一個元件中編寫適應所有螢幕的樣式，而無需維護多套程式碼。

---

## 4. 風險評估

此計畫屬於架構層面的優化，風險較低，因為它不直接修改核心業務功能。主要風險在於：

1.  **水合作用錯誤 (Hydration Errors)**：在拆分 `AppHeader` 時，必須確保所有客戶端互動的程式碼都嚴格地保留在客戶端元件中。
2.  **Context 依賴**: 在合併 Provider 時，需確保元件樹的結構正確，所有消費 Context 的子元件都在 `AppProvider` 的包裹之下。
3.  **CSS 複雜性**: 響應式設計會增加樣式表的複雜度，需要仔細測試以確保在所有斷點下顯示正常。

透過遵循上述步驟，我們可以系統性地完成這些優化，為應用程式的長期健康發展奠定更堅實的基礎。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       └── layout.tsx                  # 確保 AppProvider 包裹 children
├── components/
│   ├── layout/
│   │   ├── core/
│   │   │   ├── app-header.tsx          # 修改為 Server Component，渲染骨架
│   │   │   ├── app-header-client.tsx   # <-- 新檔案，處理所有互動邏輯
│   │   │   └── app-provider.tsx        # <-- 整合 SidebarProvider 的邏輯
│   │   └── responsive/
│   │       └── mobile-menu.tsx         # <-- 處理行動裝置側邊欄的 Sheet 元件
│   └── ui/
│       └── sidebar.tsx                 # 簡化或移除 SidebarProvider

```
