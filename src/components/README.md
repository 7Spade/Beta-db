# 元件目錄 (Components)

此目錄是整個應用程式所有 React 元件的根目錄，遵循**功能驅動 (Feature-Driven)** 和**原子設計 (Atomic Design)** 的混合原則進行組織。

## 🏗️ 組織原則

我們將元件分為三個主要類別，以實現清晰的關注點分離和最大程度的可重用性：

### 🎨 UI 元件 (Atomic Components)
- **`ui/`**: 基礎 UI 元件庫，基於 `shadcn/ui` 和 `Radix UI`
- **特點**: 最小、最通用的元件，如 `Button`, `Card`, `Input`
- **職責**: 不包含業務邏輯，只負責外觀和基礎互動
- **設計**: 遵循 Material Design 和現代 UI/UX 原則

### 🏛️ 佈局元件 (Layout Components)
- **`layout/`**: 負責應用程式的整體結構和頁面佈局
- **核心元件**: `AppShell`、側邊欄 (`UnifiedSidebar`)、頁首 (`AppHeader`)
- **職責**: 構建頁面的宏觀框架和導航結構
- **響應式**: 支援多種設備和螢幕尺寸

### ⚙️ 功能元件 (Feature Components)
- **`features/`**: 應用程式的核心業務功能實現
- **組織**: 每個子目錄代表一個具體的業務功能或模組
- **職責**: 實現特定的業務邏輯和用戶介面
- **組合**: 使用 `ui/` 和 `layout/` 中的元件建構完整功能

## 📁 目錄結構

```
src/components/
├── ui/                    # 基礎 UI 元件庫
│   ├── button.tsx        # 按鈕元件
│   ├── card.tsx          # 卡片元件
│   ├── input.tsx         # 輸入元件
│   └── ...               # 其他基礎元件
├── layout/                # 佈局和導航元件
│   ├── core/             # 核心佈局元件
│   ├── navigation/       # 導航元件
│   ├── overlays/         # 覆蓋層元件
│   ├── responsive/       # 響應式元件
│   └── shared/           # 共享佈局元件
└── features/              # 業務功能元件
    ├── contracts/        # 合約管理元件
    ├── projects/         # 專案管理元件
    ├── crm/              # CRM 管理元件
    └── ...               # 其他業務元件
```

## 🎯 設計原則

### 原子設計 (Atomic Design)
- **Atoms**: 最基本的 UI 元件 (Button, Input, Label)
- **Molecules**: 由原子組成的簡單組合 (SearchBar, FormField)
- **Organisms**: 複雜的 UI 區塊 (Header, Sidebar, Footer)
- **Templates**: 頁面佈局的骨架
- **Pages**: 完整的頁面實例

### 功能驅動 (Feature-Driven)
- **高內聚**: 相關功能的元件都放在一起
- **低耦合**: 基礎 UI 元件與業務邏輯分離
- **易於維護**: 快速定位和修改特定功能
- **可重用性**: 最大化元件的重複使用

## 🔧 開發規範

### 元件命名
- 使用 PascalCase 命名元件
- 文件名與元件名保持一致
- 使用描述性的名稱表達元件用途

### 類型安全
- 所有元件都使用 TypeScript
- 定義清晰的 Props 介面
- 使用泛型提升元件的靈活性

### 樣式管理
- 優先使用 Tailwind CSS 類別
- 複雜樣式使用 CSS Modules 或 Styled Components
- 保持樣式的一致性和可維護性

### 效能優化
- 使用 React.memo 避免不必要的重渲染
- 實作適當的程式碼分割
- 優化圖片和資源載入

## 📱 響應式設計

- **移動優先**: 從移動端開始設計
- **斷點系統**: 使用 Tailwind CSS 的響應式斷點
- **觸控友好**: 優化觸控設備的使用體驗
- **無障礙**: 遵循 WCAG 無障礙設計標準

## 🚀 未來規劃

- **元件庫文檔**: 建立完整的元件使用文檔
- **Storybook 整合**: 使用 Storybook 進行元件開發和測試
- **設計系統**: 建立統一的設計語言和規範
- **效能監控**: 實作元件效能監控和分析
- **自動化測試**: 增加元件的單元測試和整合測試
