# 身份驗證模組 (Authentication Module)

## 概述

此模組是整個應用程式安全和使用者身份管理的基石。它負責處理從使用者註冊到登入的全流程。

## 架構設計

本模組遵循清晰的目錄結構，將不同關注點分離：

- **`views/`**: `login-view.tsx`, `register-view.tsx` 等，這些是構成使用者介面的主要 React 元件。
- **`actions/`**: `auth-actions.ts` 存放與身份驗證相關的 Server Actions，例如 `signInWithEmail` 和 `createUserProfile`。
- **`hooks/`**: `use-auth.ts` 自定義 Hook，用於在客戶端元件中輕鬆獲取當前使用者的認證狀態和個人資料。
- **`providers/`**: `auth-provider.tsx` 是一個高階元件 (HOC)，負責保護路由，確保只有已登入且具有適當權限的使用者才能訪問受保護的頁面。
- **`schemas/`**: `auth-form-schemas.ts` 使用 Zod 定義了所有認證表單（如登入、註冊）的驗證規則。

## 核心功能

- **使用者註冊與登入**: 支援 Email/密碼和 Google 社交登入。
- **帳號審核流程**: 新使用者註冊後狀態為 `pending`，需由管理員在後台 (`/user`) 審核通過後才能訪問主應用。
- **路由保護**: `AuthProvider` 會自動根據使用者的狀態（未登入、待審核、已批准）將其導向到正確的頁面。
