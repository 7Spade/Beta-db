# 基礎 UI 元件庫 (UI Components)

此目錄是我們應用程式的**原子設計層 (Atomic Design)**，基於 **shadcn/ui** 建立。它包含了所有最基礎、可重用的 UI 元件。

## 設計原則

- **無業務邏輯**: 此目錄中的所有元件都**嚴格禁止**包含任何業務邏輯。它們是純粹的、展示性的元件。例如，`Button` 元件只知道如何渲染一個按鈕，但不知道點擊它會觸發「儲存合約」的動作。
- **高可重用性**: 這些元件（如 `Card`, `Input`, `Table`）被設計為可以在應用程式的任何地方使用。
- **樣式一致性**: 所有元件都遵循 `globals.css` 中定義的設計系統和主題變數，確保整個應用程式的視覺風格保持一致。

## 元件分類

### 表單元件 (Form Components)
- `accordion` - 手風琴元件
- `alert-dialog` - 警告對話框
- `button` - 按鈕元件
- `checkbox` - 複選框
- `form` - 表單元件
- `input` - 輸入框
- `input-otp` - OTP 輸入框
- `label` - 標籤
- `radio-group` - 單選按鈕組
- `select` - 選擇器
- `slider` - 滑塊
- `switch` - 開關
- `textarea` - 多行文字輸入
- `toggle` - 切換按鈕
- `toggle-group` - 切換按鈕組

### 佈局元件 (Layout Components)
- `aspect-ratio` - 寬高比容器
- `card` - 卡片容器
- `collapsible` - 可折疊容器
- `drawer` - 抽屜
- `modal` - 模態框
- `resizable` - 可調整大小容器
- `scroll-area` - 滾動區域
- `separator` - 分隔線
- `sheet` - 側邊面板
- `sidebar` - 側邊欄

### 導航元件 (Navigation Components)
- `breadcrumb` - 麵包屑導航
- `command` - 命令面板
- `context-menu` - 右鍵選單
- `dropdown-menu` - 下拉選單
- `hover-card` - 懸停卡片
- `menubar` - 選單列
- `navigation-menu` - 導航選單
- `pagination` - 分頁
- `popover` - 彈出框
- `tabs` - 標籤頁

### 反饋元件 (Feedback Components)
- `alert` - 警告提示
- `progress` - 進度條
- `skeleton` - 骨架屏
- `sonner` - 通知元件
- `toast` - 輕提示
- `toaster` - 提示容器
- `tooltip` - 工具提示

### 資料展示 (Data Display)
- `avatar` - 頭像
- `badge` - 徽章
- `calendar` - 日曆
- `carousel` - 輪播圖
- `chart` - 圖表
- `table` - 表格

### 互動元件 (Interactive Components)
- `dialog` - 對話框

## 元件總覽

目前共有 **52 個基礎 UI 元件**，涵蓋了現代 Web 應用程式所需的所有基本互動元素。這些元件都經過精心設計，確保：

- **無障礙性**: 支援鍵盤導航和螢幕閱讀器
- **響應式設計**: 適配各種螢幕尺寸
- **主題支援**: 支援亮色/暗色主題切換
- **動畫效果**: 流暢的過渡和互動動畫

這些元件是構建所有 `features/` 目錄下複雜功能元件的基石。每個元件都可以獨立使用，也可以組合使用來創建更複雜的介面。
