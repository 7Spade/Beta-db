# Auth Module - 認證模組

## 模組概述
Auth 模組提供完整的用戶認證功能，整合 Firebase Authentication 和自定義認證邏輯。

## 功能特性
- 🔐 多種登入方式支援
- 📱 響應式設計
- 🚀 基於 React 19 + NextJS 15
- 🎨 使用 Shadcn/ui 組件
- 🔒 完整的認證流程
- 📊 認證狀態管理

## 目錄結構
```
auth/
├── actions/          # 認證操作邏輯
├── components/       # UI 組件
├── constants/        # 常數定義
├── dialogs/          # 對話框組件
├── forms/            # 表單組件
├── hooks/            # React Hooks
├── providers/        # Context Providers
├── services/         # 認證服務
├── sheets/           # 側邊欄組件
├── types/            # TypeScript 類型
├── utils/            # 工具函數
└── views/            # 頁面視圖
```

## 使用方式
```tsx
import { useAuth, AuthProvider } from '@/components/features/auth';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

## 技術棧
- Firebase Authentication
- React 19 (useActionState, useFormStatus)
- NextJS 15 App Router
- Shadcn/ui + Tailwind CSS v4
- TypeScript