# 設定模組 (Settings Module)

## 概述

此模組負責提供使用者個人的應用程式設定功能。

## 架構設計

- **`settings-view.tsx`**: 作為設定頁面的主要 UI 元件。

### 核心功能

- **外觀設定**: 允許使用者切換應用程式的佈景主題（淺色、深色、跟隨系統）。
- **個人資料**: 提供連結到個人資料頁面的入口。
- **關於**: 顯示應用程式的版本資訊。

## 使用方式

`SettingsView` 元件被用作 `/app/(dashboard)/settings` 路由頁面的主要內容。

```tsx
// src/app/(dashboard)/settings/page.tsx
import { SettingsView } from '@/features/website-cms/settings-view';

export default function SettingsPage() {
  return <SettingsView />;
}
```
