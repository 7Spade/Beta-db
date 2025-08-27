# 設計系統 (Design System)

本文件定義了 Beta-db 平台的統一設計語言，以確保整個應用程式的視覺一致性和使用者體驗的連貫性。所有開發都應遵循此規範。

## 1. 顏色 (Colors)

我們的顏色系統定義在 `src/app/globals.css` 中，使用 HSL CSS 變數，便於在深色和淺色模式之間切換。

- **`--primary`**: 主要操作顏色，用於按鈕、活動狀態和關鍵連結。
- **`--secondary`**: 次要顏色，用於次要按鈕、標籤和不太重要的元素。
- **`--background`**: 應用程式的主要背景色。
- **`--foreground`**: 主要文字和圖示的顏色。
- **`--card`**: 卡片元件的背景色。
- **`--accent`**: 用於需要突出的元素，如提示或特定狀態。
- **`--destructive`**: 用於表示危險或破壞性操作的顏色，如刪除按鈕。

**使用原則**:
- **禁止硬編碼**: 嚴禁在元件中使用 Tailwind 的硬編碼顏色（如 `bg-blue-500`）。應始終使用 CSS 變數（如 `bg-primary`, `text-destructive`）。
- **語意化**: 根據元素的語意功能選擇顏色，而不是其具體色值。

## 2. 字體 (Typography)

- **主要字體**: Inter。定義在 `src/app/layout.tsx` 中。
- **字體大小**:
    - **標題 (Headings)**: 使用 Tailwind 的 `text-xl`, `text-2xl`, `text-3xl` 等。
    - **內文 (Body)**: 預設為 `text-base` 或 `text-sm`。
    - **輔助文字 (Helper Text)**: `text-xs`。
- **字重 (Font Weight)**:
    - **一般**: `font-normal`
    - **中等**: `font-medium`
    - **粗體**: `font-bold`

## 3. 間距與尺寸 (Spacing & Sizing)

- **基礎單位**: 我們使用 Tailwind 的間距單位，其基礎為 `4px`。
    - `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, 以此類推。
- **元件間距**: 元件之間的間距應使用 `gap-` 或 `space-y-` / `space-x-`。
- **內部間距 (Padding)**: 元件的內部留白應使用 `p-`, `px-`, `py-`。

## 4. 圓角 (Border Radius)

- **`--radius`**: 全域圓角變數，定義在 `globals.css` 中。
- **元件圓角**: 使用 Tailwind 的 `rounded-sm`, `rounded-md`, `rounded-lg`，它們會自動對應到 `calc(var(--radius) - ...)`。

## 5. 陰影 (Shadows)

- 使用 Tailwind 的 `shadow-sm`, `shadow-md`, `shadow-lg` 來為卡片等元素增加層次感。

## 6. 元件庫 (Component Library)

- **核心**: **shadcn/ui**。所有基礎元件都應使用或基於 `src/components/ui` 中的元件來建構。
- **圖示**: **Lucide React**。所有圖示都應從 `lucide-react` 中導入，以確保風格統一。

---
**結論**: 一個統一的設計系統是高效開發和卓越使用者體驗的基礎。所有開發者在建構新功能或元件時，都必須嚴格遵守此設計規範。
