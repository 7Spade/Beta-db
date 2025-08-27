# 個人資料模組 (Profile Module)

## 概述

此模組負責處理使用者的個人資料顯示與編輯功能。它遵循一個穩健的、伺服器優先的架構模式。

## 架構設計

- **`views/profile-view.tsx`**:
  - **職責**: 作為個人資料頁面的主 UI 容器。
  - **功能**:
    - 接收從伺服器端傳來的 `user` 資料作為 prop。
    - 顯示唯讀的使用者資訊，如 Email、角色、狀態等。
    - 渲染 `ProfileForm` 元件，並將需要編輯的資料傳遞給它。

- **`components/profile-form.tsx`**:
  - **職責**: 一個獨立的、可重用的 `'use client'` 元件，專門負責處理個人資料的編輯表單。
  - **功能**:
    - 使用 `react-hook-form` 和 `zod` 來管理表單狀態和驗證。
    - 表單提交時，呼叫 `profile-actions.ts` 中的 Server Action 來更新資料。

- **`actions/profile-actions.ts`**:
  - **職責**: 包含與個人資料更新相關的 Server Action。
  - **功能**:
    - `updateUserProfile`: 一個安全的伺服器端函數，負責接收表單數據並更新 Firestore 中的 `users` 文件。

## 資料流

1.  **伺服器端 (`profile/page.tsx`)**:
    - 透過 `cookies` 驗證使用者身份。
    - 從 Firestore 獲取完整的使用者資料。
    - 將資料作為 `props` 傳遞給 `<ProfileView />`。

2.  **客戶端 (`ProfileView` & `ProfileForm`)**:
    - `ProfileView` 顯示資料。
    - `ProfileForm` 允許使用者編輯特定欄位。
    - 使用者點擊儲存，觸發 Server Action。
    - Server Action 更新資料庫，並使用 `revalidatePath` 來通知 Next.js 重新渲染頁面以顯示最新資料。
